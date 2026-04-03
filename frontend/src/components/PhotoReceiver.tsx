import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { API_CONFIG } from '../config/api.config';

// ── Types ────────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  filename: string;
  student_name: string;
  index: number;
  size_bytes: number;
  uploaded_at: string;
  path: string;
}

interface Session {
  id: string;
  class_name: string;
  date: string;
  folder_name: string;
  folder_path: string;
  created_at: string;
  photo_count: number;
  photos: Photo[];
}

interface PhotoReceiverProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

interface NetworkInfo {
  ip: string;
  all_ips: string[];
  port: number;
  ssl_port: number | null;
  ssl_enabled: boolean;
  phone_url: string;
  phone_url_http: string;
  phone_url_https: string | null;
}

const PhotoReceiver: React.FC<PhotoReceiverProps> = ({ tabId, savedData, onDataChange, isActive }) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [showNewSession, setShowNewSession] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Hotspot + HTTPS state
  const [hotspotActive, setHotspotActive] = useState(false);
  const [hotspotLoading, setHotspotLoading] = useState(false);
  const [hotspotInfo, setHotspotInfo] = useState<{ ssid: string; password: string } | null>(null);
  const [httpsEnabled, setHttpsEnabled] = useState(false);
  const [httpsLoading, setHttpsLoading] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);

  const BASE = API_CONFIG.BASE_URL;

  // ── Fetch network info ──
  const refreshNetworkInfo = useCallback(() => {
    fetch(`${BASE}/api/photo-transfer/network-info`)
      .then(r => r.json())
      .then(data => {
        setNetworkInfo(data);
        setHttpsEnabled(data.ssl_enabled || false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshNetworkInfo();
    // Also check hotspot status on mount
    fetch(`${BASE}/api/photo-transfer/hotspot/status`)
      .then(r => r.json())
      .then(data => setHotspotActive(data.active || false))
      .catch(() => {});
  }, []);

  // ── Hotspot controls ──
  const toggleHotspot = async () => {
    setHotspotLoading(true);
    try {
      if (hotspotActive) {
        await fetch(`${BASE}/api/photo-transfer/hotspot/stop`, { method: 'POST' });
        setHotspotActive(false);
        setHotspotInfo(null);
      } else {
        const res = await fetch(`${BASE}/api/photo-transfer/hotspot/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ssid: 'OECS-PhotoTransfer', password: 'oecs1234' }),
        });
        const data = await res.json();
        if (data.ok) {
          setHotspotActive(true);
          setHotspotInfo({ ssid: data.ssid, password: data.password });
        }
      }
      // Refresh network info after hotspot change
      setTimeout(refreshNetworkInfo, 1500);
    } catch {}
    setHotspotLoading(false);
  };

  // ── Fetch sessions ──
  const fetchSessions = useCallback(() => {
    fetch(`${BASE}/api/photo-transfer/sessions`)
      .then(r => r.json())
      .then(data => {
        setSessions(data);
        if (data.length > 0 && !activeSession) {
          setActiveSession(data[data.length - 1]);
          setPhotos(data[data.length - 1].photos || []);
          setShowNewSession(false);
        }
      })
      .catch(() => {});
  }, [activeSession]);

  useEffect(() => {
    fetchSessions();
  }, []);

  // ── SSE connection ──
  useEffect(() => {
    const es = new EventSource(`${BASE}/api/photo-transfer/stream`);
    eventSourceRef.current = es;

    es.addEventListener('connected', () => setConnected(true));

    es.addEventListener('photo_uploaded', (e) => {
      const data = JSON.parse(e.data);
      setPhotos(prev => [...prev, data.photo]);
      // Update session photo count
      setActiveSession(prev => prev ? { ...prev, photo_count: data.total_count } : prev);
    });

    es.addEventListener('session_created', (e) => {
      const session = JSON.parse(e.data);
      setSessions(prev => [...prev, session]);
      setActiveSession(session);
      setPhotos([]);
      setShowNewSession(false);
    });

    es.addEventListener('photo_deleted', (e) => {
      const data = JSON.parse(e.data);
      setPhotos(prev => prev.filter(p => p.id !== data.photo_id));
    });

    es.onerror = () => setConnected(false);
    es.onopen = () => setConnected(true);

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  // ── Cleanup: stop hotspot when component unmounts ──
  useEffect(() => {
    return () => {
      // If we started a hotspot, stop it on unmount
      if (hotspotActive) {
        fetch(`${BASE}/api/photo-transfer/hotspot/stop`, { method: 'POST' }).catch(() => {});
      }
    };
  }, [hotspotActive]);

  // ── Create session from desktop ──
  const createSession = async () => {
    const className = newClassName.trim() || 'Unnamed Class';
    try {
      const res = await fetch(`${BASE}/api/photo-transfer/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_name: className }),
      });
      const session = await res.json();
      setSessions(prev => [...prev, session]);
      setActiveSession(session);
      setPhotos([]);
      setNewClassName('');
      setShowNewSession(false);
    } catch {}
  };

  // ── Export PDF ──
  const exportPdf = async () => {
    if (!activeSession) return;
    setExportingPdf(true);
    try {
      const res = await fetch(`${BASE}/api/photo-transfer/export-pdf/${activeSession.id}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSession.class_name.replace(/\s+/g, '_')}_${activeSession.date}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setExportingPdf(false);
  };

  // ── Delete photo ──
  const deletePhoto = async (photo: Photo) => {
    if (!activeSession) return;
    try {
      await fetch(`${BASE}/api/photo-transfer/photos/${activeSession.id}/${photo.id}`, {
        method: 'DELETE',
      });
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
    } catch {}
  };

  // ── Photo image URL ──
  const photoUrl = (photo: Photo) =>
    `${BASE}/api/photo-transfer/photos/${activeSession?.id}/${photo.filename}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* ── Header ── */}
      <div style={{
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Photo Transfer</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Scan QR code with phone to send photos
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Connection status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            borderRadius: 20,
            background: connected ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${connected ? '#bbf7d0' : '#fecaca'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: connected ? '#22c55e' : '#ef4444',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: connected ? '#16a34a' : '#dc2626' }}>
              {connected ? 'Ready' : 'Connecting...'}
            </span>
          </div>

          {activeSession && photos.length > 0 && (
            <button
              onClick={exportPdf}
              disabled={exportingPdf}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: '#2563eb',
                color: 'white',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: exportingPdf ? 0.6 : 1,
              }}
            >
              {exportingPdf ? 'Exporting...' : 'Export PDF'}
            </button>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: QR Code + Sessions ── */}
        <div style={{
          width: 320,
          minWidth: 320,
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          {/* QR Code + Connection */}
          {networkInfo && networkInfo.ip !== '127.0.0.1' ? (
            <div style={{ padding: 20, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>
                Scan with your phone camera
              </p>
              <div style={{
                background: 'white',
                padding: 16,
                borderRadius: 12,
                border: '2px solid #e2e8f0',
                display: 'inline-block',
              }}>
                <QRCodeSVG value={networkInfo.phone_url} size={200} level="M" />
              </div>
              <div style={{
                marginTop: 12,
                padding: '8px 12px',
                background: '#f1f5f9',
                borderRadius: 8,
                fontSize: 13,
                color: '#334155',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}>
                {networkInfo.phone_url}
              </div>

              {/* Connection mode badges */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {httpsEnabled && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                  }}>HTTPS (iOS Ready)</span>
                )}
                {hotspotActive && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                  }}>Hotspot Active</span>
                )}
              </div>

              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                Phone must be on the same network as this PC
              </p>
            </div>
          ) : (
            <div style={{ padding: 20, textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#fef3c7', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>No Network Detected</p>
              <p style={{ fontSize: 12, color: '#b45309', marginTop: 4 }}>
                Connect to WiFi or use the hotspot button below to create a direct connection.
              </p>
            </div>
          )}

          {/* ── Hotspot Controls ── */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Laptop Hotspot</span>
              </div>
              <button
                onClick={toggleHotspot}
                disabled={hotspotLoading}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: hotspotActive ? '#fef2f2' : '#eff6ff',
                  color: hotspotActive ? '#dc2626' : '#2563eb',
                  opacity: hotspotLoading ? 0.6 : 1,
                }}
              >
                {hotspotLoading ? '...' : hotspotActive ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
            {hotspotActive && hotspotInfo && (
              <div style={{
                padding: '8px 12px', borderRadius: 8,
                background: '#f8fafc', fontSize: 12, color: '#475569',
              }}>
                <div>Network: <strong>{hotspotInfo.ssid}</strong></div>
                <div>Password: <strong>{hotspotInfo.password}</strong></div>
              </div>
            )}
            {!hotspotActive && (
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                No WiFi? Turn on hotspot and connect your phone to it.
              </p>
            )}
          </div>

          {/* Sessions */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>Sessions</h3>
              <button
                onClick={() => setShowNewSession(true)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0',
                  background: 'white', fontSize: 12, fontWeight: 600, color: '#2563eb', cursor: 'pointer',
                }}
              >
                + New
              </button>
            </div>

            {showNewSession && (
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Class name (e.g. Math Grade 5)"
                  onKeyDown={e => e.key === 'Enter' && createSession()}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: '2px solid #e2e8f0', fontSize: 14, marginBottom: 8,
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  autoFocus
                />
                <button
                  onClick={createSession}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8,
                    background: '#2563eb', color: 'white', border: 'none',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Create Session
                </button>
              </div>
            )}

            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSession(s);
                  setPhotos(s.photos || []);
                  setShowNewSession(false);
                  setSelectedPhoto(null);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  marginBottom: 4,
                  cursor: 'pointer',
                  background: activeSession?.id === s.id ? '#eff6ff' : 'transparent',
                  border: activeSession?.id === s.id ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{s.class_name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {s.date} &middot; {s.photo_count} photo{s.photo_count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}

            {sessions.length === 0 && !showNewSession && (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 16 }}>
                No sessions yet. Create one or scan QR from your phone.
              </p>
            )}
          </div>
        </div>

        {/* ── Right: Photo Grid ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {activeSession ? (
            <>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {activeSession.class_name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                    {activeSession.date} &middot; {photos.length} photo{photos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {photos.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: '#94a3b8',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>Waiting for photos...</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Scan the QR code on the left with your phone to start sending photos</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 12,
                }}>
                  {photos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      style={{
                        borderRadius: 10,
                        overflow: 'hidden',
                        background: 'white',
                        border: selectedPhoto?.id === photo.id ? '2px solid #2563eb' : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        boxShadow: selectedPhoto?.id === photo.id ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '100%', aspectRatio: '4/3', overflow: 'hidden',
                        background: '#f1f5f9',
                      }}>
                        <img
                          src={photoUrl(photo)}
                          alt={photo.filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {photo.student_name || `Photo ${photo.index}`}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          {(photo.size_bytes / 1024).toFixed(0)} KB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: '80px 20px',
              color: '#94a3b8',
            }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Create a session to get started</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Or scan the QR code from your phone — a session will be created automatically.
              </p>
            </div>
          )}
        </div>

        {/* ── Photo detail sidebar ── */}
        {selectedPhoto && activeSession && (
          <div style={{
            width: 320,
            minWidth: 320,
            background: 'white',
            borderLeft: '1px solid #e2e8f0',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>Photo Detail</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: '1px solid #e2e8f0', background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <img
                src={photoUrl(selectedPhoto)}
                alt={selectedPhoto.filename}
                style={{
                  width: '100%', borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />

              <div style={{ marginTop: 16 }}>
                <DetailRow label="Student" value={selectedPhoto.student_name || '—'} />
                <DetailRow label="Filename" value={selectedPhoto.filename} />
                <DetailRow label="Size" value={`${(selectedPhoto.size_bytes / 1024).toFixed(1)} KB`} />
                <DetailRow label="Uploaded" value={new Date(selectedPhoto.uploaded_at).toLocaleTimeString()} />
              </div>

              <button
                onClick={() => deletePhoto(selectedPhoto)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 16,
                }}
              >
                Delete Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Detail row ───────────────────────────────────────────────────────────────

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
  </div>
);

export default PhotoReceiver;
