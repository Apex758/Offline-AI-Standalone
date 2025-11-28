import io
import csv
import json
from typing import Any, Dict, List, Union

from docx import Document
from docx.shared import Pt
from weasyprint import HTML

def export_to_docx(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export data to DOCX format.
    """
    try:
        doc = Document()
        doc.add_heading(title, 0)
        if isinstance(data, str):
            doc.add_paragraph(data)
        elif isinstance(data, dict):
            for k, v in data.items():
                doc.add_paragraph(f"{k}: {v}")
        elif isinstance(data, list):
            for item in data:
                doc.add_paragraph(str(item))
        else:
            doc.add_paragraph(str(data))
        buf = io.BytesIO()
        doc.save(buf)
        return buf.getvalue()
    except Exception as e:
        raise RuntimeError(f"Failed to export DOCX: {e}")

def export_to_pdf(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export data to PDF format using WeasyPrint.
    """
    try:
        html = f"<h1>{title}</h1>"
        if isinstance(data, str):
            html += f"<pre>{data}</pre>"
        elif isinstance(data, dict):
            html += "<ul>"
            for k, v in data.items():
                html += f"<li><b>{k}:</b> {v}</li>"
            html += "</ul>"
        elif isinstance(data, list):
            html += "<ul>"
            for item in data:
                html += f"<li>{item}</li>"
            html += "</ul>"
        else:
            html += f"<pre>{str(data)}</pre>"
        pdf_bytes = HTML(string=html).write_pdf()
        return pdf_bytes
    except Exception as e:
        raise RuntimeError(f"Failed to export PDF: {e}")

def export_to_csv(data: Union[List[Dict], List[List], Dict, List], title: str = "Export") -> bytes:
    """
    Export data to CSV format.
    """
    try:
        buf = io.StringIO()
        writer = csv.writer(buf)
        if isinstance(data, list):
            if all(isinstance(row, dict) for row in data):
                # Write header
                if data:
                    writer.writerow(data[0].keys())
                    for row in data:
                        writer.writerow(row.values())
            elif all(isinstance(row, list) for row in data):
                for row in data:
                    writer.writerow(row)
            else:
                for item in data:
                    writer.writerow([item])
        elif isinstance(data, dict):
            writer.writerow(data.keys())
            writer.writerow(data.values())
        else:
            writer.writerow([str(data)])
        return buf.getvalue().encode("utf-8")
    except Exception as e:
        raise RuntimeError(f"Failed to export CSV: {e}")

def export_to_json(data: Any, title: str = "Export") -> bytes:
    """
    Export data to JSON format.
    """
    try:
        return json.dumps(data, indent=2, ensure_ascii=False).encode("utf-8")
    except Exception as e:
        raise RuntimeError(f"Failed to export JSON: {e}")

def export_to_markdown(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export data to Markdown format.
    """
    try:
        md = f"# {title}\n\n"
        if isinstance(data, str):
            md += data
        elif isinstance(data, dict):
            for k, v in data.items():
                md += f"- **{k}**: {v}\n"
        elif isinstance(data, list):
            for item in data:
                md += f"- {item}\n"
        else:
            md += str(data)
        return md.encode("utf-8")
    except Exception as e:
        raise RuntimeError(f"Failed to export Markdown: {e}")

EXPORT_FORMATTERS = {
    "pdf": export_to_pdf,
    "docx": export_to_docx,
    "csv": export_to_csv,
    "json": export_to_json,
    "md": export_to_markdown,
    "markdown": export_to_markdown,
}