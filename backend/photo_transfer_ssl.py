"""
Self-signed SSL certificate generator + HTTPS server for Photo Transfer.

iOS Safari requires HTTPS for camera access on non-localhost origins.
This module generates a self-signed cert on the fly and runs a second
uvicorn instance on a separate port (8443) with TLS.

The cert is stored in APPDATA so it persists across sessions.
"""

import logging
import os
import ssl
import subprocess
import sys
import threading
from pathlib import Path

logger = logging.getLogger(__name__)

HTTPS_PORT = 8443


def _get_cert_dir() -> Path:
    """Return the directory where we store the self-signed cert."""
    if os.name == "nt":
        app_data = os.environ.get("APPDATA", os.path.expanduser("~"))
        d = Path(app_data) / "OECS Teacher Assistant" / "ssl"
    else:
        d = Path.home() / ".olh_ai_education" / "ssl"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _cert_path() -> Path:
    return _get_cert_dir() / "photo-transfer.crt"


def _key_path() -> Path:
    return _get_cert_dir() / "photo-transfer.key"


def ensure_self_signed_cert() -> tuple[str, str]:
    """Generate a self-signed cert if one doesn't exist. Returns (cert_path, key_path)."""
    cert = _cert_path()
    key = _key_path()

    if cert.exists() and key.exists():
        logger.info(f"SSL cert already exists at {cert}")
        return str(cert), str(key)

    logger.info("Generating self-signed SSL certificate for Photo Transfer...")

    # Try using Python's built-in ssl to generate via subprocess with openssl
    # Fallback: generate using pure Python cryptography if available
    try:
        _generate_with_cryptography(cert, key)
        logger.info(f"SSL cert generated at {cert}")
        return str(cert), str(key)
    except ImportError:
        pass

    # Try openssl CLI
    try:
        _generate_with_openssl(cert, key)
        logger.info(f"SSL cert generated via openssl at {cert}")
        return str(cert), str(key)
    except Exception as e:
        logger.warning(f"openssl failed: {e}")

    # Final fallback: generate a minimal self-signed cert in pure Python
    _generate_minimal_cert(cert, key)
    logger.info(f"SSL cert generated (minimal) at {cert}")
    return str(cert), str(key)


def _generate_with_cryptography(cert_path: Path, key_path: Path):
    """Generate using the `cryptography` package if available."""
    from cryptography import x509
    from cryptography.x509.oid import NameOID
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    import datetime

    # Generate key
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

    # Build cert
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, "OECS Photo Transfer"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "OECS Teacher Assistant"),
    ])

    # Add SAN with all local IPs
    from routes.photo_transfer import _get_all_local_ips
    san_entries = [x509.DNSName("localhost")]
    for ip in _get_all_local_ips():
        try:
            import ipaddress
            san_entries.append(x509.IPAddress(ipaddress.ip_address(ip)))
        except Exception:
            pass

    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.datetime.utcnow())
        .not_valid_after(datetime.datetime.utcnow() + datetime.timedelta(days=365))
        .add_extension(x509.SubjectAlternativeName(san_entries), critical=False)
        .sign(private_key, hashes.SHA256())
    )

    key_path.write_bytes(
        private_key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.TraditionalOpenSSL,
            serialization.NoEncryption(),
        )
    )
    cert_path.write_bytes(cert.public_bytes(serialization.Encoding.PEM))


def _generate_with_openssl(cert_path: Path, key_path: Path):
    """Generate using openssl CLI."""
    from routes.photo_transfer import _get_all_local_ips
    ips = _get_all_local_ips()
    san = ",".join([f"IP:{ip}" for ip in ips] + ["DNS:localhost"])

    subprocess.run([
        "openssl", "req", "-x509", "-newkey", "rsa:2048",
        "-keyout", str(key_path), "-out", str(cert_path),
        "-days", "365", "-nodes",
        "-subj", "/CN=OECS Photo Transfer/O=OECS Teacher Assistant",
        "-addext", f"subjectAltName={san}",
    ], check=True, capture_output=True)


def _generate_minimal_cert(cert_path: Path, key_path: Path):
    """Absolute fallback — write placeholder files so the module doesn't crash.
    If neither cryptography nor openssl is available, HTTPS won't work but
    the app will still function over HTTP."""
    logger.error("Cannot generate SSL cert — neither cryptography package nor openssl available")
    logger.error("Photo Transfer will work over HTTP only (iOS camera may not work)")
    # Write empty files so callers don't crash on missing files
    cert_path.write_text("")
    key_path.write_text("")


# ── HTTPS server thread ─────────────────────────────────────────────────────

_https_thread: threading.Thread | None = None
_https_running = False


def start_https_server():
    """Start a second uvicorn instance on HTTPS_PORT with the self-signed cert."""
    global _https_thread, _https_running

    if _https_running:
        logger.info("HTTPS server already running")
        return True

    cert, key = ensure_self_signed_cert()
    if not cert or not Path(cert).stat().st_size:
        logger.error("No valid SSL cert — cannot start HTTPS server")
        return False

    def _run():
        global _https_running
        try:
            import uvicorn
            from main import app
            from routes.photo_transfer import set_ssl_status

            set_ssl_status(True, HTTPS_PORT)
            _https_running = True
            logger.info(f"Starting HTTPS server on port {HTTPS_PORT}")

            uvicorn.run(
                app,
                host="0.0.0.0",
                port=HTTPS_PORT,
                ssl_certfile=cert,
                ssl_keyfile=key,
                log_level="warning",
            )
        except Exception as e:
            logger.error(f"HTTPS server failed: {e}")
        finally:
            _https_running = False
            from routes.photo_transfer import set_ssl_status
            set_ssl_status(False, None)

    _https_thread = threading.Thread(target=_run, daemon=True, name="photo-transfer-https")
    _https_thread.start()
    return True


def stop_https_server():
    """Stop the HTTPS server (daemon thread dies when main process exits)."""
    global _https_running
    _https_running = False
    from routes.photo_transfer import set_ssl_status
    set_ssl_status(False, None)
