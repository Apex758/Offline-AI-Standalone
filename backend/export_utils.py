import io
import csv
import json
from typing import Any, Dict, List, Union
from bs4 import BeautifulSoup
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import re


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def add_table_borders(table):
    """Add borders to a table"""
    tbl = table._element
    tblPr = tbl.tblPr
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)
    
    tblBorders = OxmlElement('w:tblBorders')
    for border_name in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'single')
        border.set(qn('w:sz'), '4')
        border.set(qn('w:space'), '0')
        border.set(qn('w:color'), 'CCCCCC')
        tblBorders.append(border)
    
    tblPr.append(tblBorders)


def parse_lesson_content_for_export(text: str) -> List[Dict[str, Any]]:
    """Parse lesson plan text into structured sections for export"""
    if not text:
        return []
    
    lines = text.split('\n')
    sections = []
    current_section = None
    details = []
    
    for line in lines:
        trimmed = line.strip()
        
        if not trimmed:
            continue
        
        # Collect basic details for grid
        match = re.match(r'^\*\*(Grade Level|Subject|Strand|Topic|Duration|Date):\*\* (.+)', trimmed)
        if match:
            label, value = match.groups()
            details.append({'label': label, 'value': value})
            if len(details) == 6:
                sections.append({'type': 'details_grid', 'items': details.copy()})
                details = []
            continue
        
        # Skip main lesson title
        if re.match(r'^\*\*Lesson Plan:', trimmed):
            continue
        
        # Section headings (surrounded by **)
        match = re.match(r'^\*\*(.+)\*\*$', trimmed)
        if match:
            title = match.group(1)
            current_section = {'type': 'section', 'title': title, 'content': []}
            sections.append(current_section)
            continue
        
        # Field labels (start with ** but don't end with **)
        if re.match(r'^\*\*[^*]+:\*\*', trimmed) or re.match(r'^\*\*[^*]+:$', trimmed):
            title = re.sub(r'^\*\*', '', trimmed).replace('**', '').replace(':', '').strip()
            current_section = {'type': 'field', 'title': title, 'content': []}
            sections.append(current_section)
            continue
        
        # Bullet points with + (nested)
        match = re.match(r'^\s*\+\s+(.+)', trimmed)
        if match:
            content = match.group(1)
            if current_section:
                current_section['content'].append({'type': 'nested_bullet', 'text': content})
            continue
        
        # Regular bullet points
        match = re.match(r'^\s*\*\s+(.+)', trimmed)
        if match:
            if not trimmed.startswith('**'):
                content = match.group(1)
                if current_section:
                    current_section['content'].append({'type': 'bullet', 'text': content})
                continue
        
        # Numbered items
        match = re.match(r'^(\d+)\.\s*(.+)', trimmed)
        if match:
            number, content = match.groups()
            if current_section:
                current_section['content'].append({'type': 'numbered', 'number': number, 'text': content})
            continue
        
        # Regular paragraphs
        if current_section:
            current_section['content'].append({'type': 'paragraph', 'text': trimmed})
    
    return sections


def export_to_docx(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export to DOCX format.
    Uses rawHtml if provided for perfect visual consistency with PDF and screen.
    """
    try:
        # Get data
        if isinstance(data, dict):
            raw_html = data.get('rawHtml', '')
            content = data.get('content', '')
            form_data = data.get('formData', {})
            accent_color = data.get('accentColor', '#3B82F6')
        else:
            raw_html = ''
            content = str(data)
            form_data = {}
            accent_color = '#3B82F6'
        
        # ✅ PRIORITY: Use HTML parser for perfect consistency
        if raw_html:
            return export_to_docx_from_html(raw_html, accent_color, form_data)
        
        # Fallback to simple text-based DOCX
        doc = Document()
        doc.add_heading(title, 0)
        doc.add_paragraph(content)
        
        buf = io.BytesIO()
        doc.save(buf)
        return buf.getvalue()
         
    except Exception as e:
        raise RuntimeError(f"Failed to export DOCX: {e}")



def export_to_pdf(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export to PDF using HTML.
    If rawHtml is provided, uses it directly for perfect consistency.
    """
    import os
    import sys
    if sys.platform == "win32":
        script_dir = os.path.dirname(os.path.abspath(__file__))
        gtk_bin = os.path.join(script_dir, "bin")
        if not os.path.isdir(gtk_bin):
            parent_dir = os.path.dirname(script_dir)
            backend_bundle_bin = os.path.join(parent_dir, "backend-bundle", "bin")
            if os.path.isdir(backend_bundle_bin):
                gtk_bin = backend_bundle_bin
        
        if os.path.isdir(gtk_bin):
            os.environ["WEASYPRINT_DLL_DIRECTORIES"] = gtk_bin
            if hasattr(os, "add_dll_directory"):
                try:
                    os.add_dll_directory(gtk_bin)
                except:
                    pass
            os.environ["PATH"] = gtk_bin + os.pathsep + os.environ.get("PATH", "")
    
    from weasyprint import HTML
    try:
        # ✅ PRIORITY: Use rawHtml if provided (perfect consistency)
        if isinstance(data, dict) and data.get("rawHtml"):
            html = data["rawHtml"]
            pdf_bytes = HTML(string=html).write_pdf()
            return pdf_bytes

        # Fallback to legacy HTML generation
        if isinstance(data, dict):
            content = data.get('content', '')
            form_data = data.get('formData', {})
            accent_color = data.get('accentColor', '#3B82F6')
        else:
            content = str(data)
            form_data = {}
            accent_color = '#3B82F6'

        # Build basic HTML (legacy fallback)
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{
                    font-family: 'Segoe UI', sans-serif;
                    line-height: 1.6;
                    color: #374151;
                    margin: 2cm;
                }}
                pre {{
                    white-space: pre-wrap;
                    font-family: inherit;
                }}
            </style>
        </head>
        <body>
            <h1 style="color: {accent_color};">{title}</h1>
            <pre>{content}</pre>
        </body>
        </html>
        """

        pdf_bytes = HTML(string=html).write_pdf()
        return pdf_bytes

    except Exception as e:
        raise RuntimeError(f"Failed to export PDF: {e}")


def export_to_docx_from_html(html: str, accent_color: str, form_data: dict) -> bytes:
    """
    Convert HTML to DOCX while preserving formatting.
    This ensures DOCX matches PDF and screen display exactly.
    """
    doc = Document()
    soup = BeautifulSoup(html, 'html.parser')
    rgb = hex_to_rgb(accent_color)
    
    # Parse header section (gradient banner)
    # Find the header div by looking for the subject badge
    header_section = soup.find('div', style=lambda x: x and 'gradient' in str(x) if x else False)
    
    if not header_section:
        # Try finding by structure
        for div in soup.find_all('div'):
            if div.find('span') and div.find('h1'):
                header_section = div
                break
    
    if header_section:
        # Add subject badge
        badge = header_section.find('span')
        if badge:
            p = doc.add_paragraph()
            run = p.add_run(badge.text)
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.bold = True
            # Simulate badge background with shading
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            doc.add_paragraph()  # Spacing
        
        # Add main title
        title_h1 = header_section.find('h1')
        if title_h1:
            p = doc.add_paragraph()
            run = p.add_run(title_h1.text)
            run.font.size = Pt(24)
            run.font.color.rgb = RGBColor(*rgb)
            run.font.bold = True
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            doc.add_paragraph()  # Spacing
    
    # Parse main content
    # Get the content div (after header)
    content_divs = soup.find_all('div', recursive=False)
    
    # Find content div (usually the one after header with margin-top)
    content_div = None
    for div in content_divs:
        style = div.get('style', '')
        if 'margin-top: 2rem' in style or div.find(['h2', 'h3', 'p']):
            content_div = div
            break
    
    if not content_div:
        # Fallback: get body content
        content_div = soup.find('body')
    
    if content_div:
        # Process each element
        for element in content_div.find_all(['h2', 'h3', 'div', 'p'], recursive=True):
            style = element.get('style', '')
            text = element.get_text(strip=True)
            
            if not text:
                continue
            
            # Section headings (h2)
            if element.name == 'h2':
                heading = doc.add_heading(text, level=1)
                heading.runs[0].font.color.rgb = RGBColor(*rgb)
                heading.runs[0].font.size = Pt(18)
                
            # Question headings (h3)
            elif element.name == 'h3':
                heading = doc.add_heading(text, level=2)
                heading.runs[0].font.color.rgb = RGBColor(
                    int(rgb[0] * 0.8),
                    int(rgb[1] * 0.8),
                    int(rgb[2] * 0.8)
                )
                heading.runs[0].font.size = Pt(14)
                
            # Answer options (divs with A), B), etc.)
            elif element.name == 'div' and re.match(r'^[A-D]\)', text):
                p = doc.add_paragraph()
                letter_run = p.add_run(text[:2] + ' ')
                letter_run.font.bold = True
                letter_run.font.color.rgb = RGBColor(*rgb)
                content_run = p.add_run(text[2:].strip())
                p.paragraph_format.left_indent = Inches(0.25)
                
            # Bullet points (divs with •)
            elif element.name == 'div' and '•' in text[:2]:
                content = text.replace('•', '').strip()
                p = doc.add_paragraph(content, style='List Bullet')
                p.paragraph_format.left_indent = Inches(0.25)
                
            # Numbered lists (divs with numbers)
            elif element.name == 'div' and re.match(r'^\d+\.', text):
                content = re.sub(r'^\d+\.\s*', '', text)
                p = doc.add_paragraph(content, style='List Number')
                p.paragraph_format.left_indent = Inches(0.25)
                
            # Regular paragraphs
            elif element.name == 'p':
                p = doc.add_paragraph(text)
                p.paragraph_format.space_after = Pt(6)
    
    # Add footer
    footer = doc.sections[0].footer
    footer_p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
    footer_p.text = f"Generated on {form_data.get('date', 'N/A')}"
    footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer_run = footer_p.runs[0]
    footer_run.font.size = Pt(9)
    footer_run.font.color.rgb = RGBColor(156, 163, 175)
    
    # Save to bytes
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


def format_section_content_html(content: List[Dict]) -> str:
    """Format section content as HTML"""
    html = ''
    
    # Group consecutive bullets and numbered items
    current_list_type = None
    
    for item in content:
        item_type = item['type']
        
        if item_type == 'bullet' or item_type == 'nested_bullet':
            if current_list_type != 'bullet':
                if current_list_type:
                    html += '</ul>' if current_list_type == 'bullet' else '</ol>'
                html += '<ul class="bullet-list">'
                current_list_type = 'bullet'
            
            css_class = 'nested-bullet' if item_type == 'nested_bullet' else ''
            html += f'<li class="{css_class}">{item["text"]}</li>'
        
        elif item_type == 'numbered':
            if current_list_type != 'numbered':
                if current_list_type:
                    html += '</ul>' if current_list_type == 'bullet' else '</ol>'
                html += '<ol class="numbered-list">'
                current_list_type = 'numbered'
            
            html += f'<li>{item["text"]}</li>'
        
        elif item_type == 'paragraph':
            if current_list_type:
                html += '</ul>' if current_list_type == 'bullet' else '</ol>'
                current_list_type = None
            
            html += f'<p>{item["text"]}</p>'
    
    # Close any open lists
    if current_list_type:
        html += '</ul>' if current_list_type == 'bullet' else '</ol>'
    
    return html


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