import io
import csv
import json
from typing import Any, Dict, List, Union

from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from weasyprint import HTML
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
    Export data to DOCX format with rich formatting matching the webpage.
    """
    try:
        doc = Document()
        
        # Get formatting data
        if isinstance(data, dict):
            content = data.get('content', '')
            form_data = data.get('formData', {})
            accent_color = data.get('accentColor', '#3B82F6')
        else:
            content = str(data)
            form_data = {}
            accent_color = '#3B82F6'
        
        rgb = hex_to_rgb(accent_color)
        
        # Add modern header section
        if form_data:
            # Add header with gradient effect (simulated with shading)
            header = doc.add_paragraph()
            header.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Subject badge
            subject_run = header.add_run(form_data.get('subject', 'Mathematics'))
            subject_run.font.size = Pt(10)
            subject_run.font.color.rgb = RGBColor(255, 255, 255)
            subject_run.font.bold = True
            
            # Add spacing
            doc.add_paragraph()
            
            # Main title
            title_para = doc.add_paragraph()
            title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            title_run = title_para.add_run(f"Exploring {form_data.get('topic', 'Lesson Plan')}")
            title_run.font.size = Pt(24)
            title_run.font.bold = True
            title_run.font.color.rgb = RGBColor(*rgb)
            
            doc.add_paragraph()
            
            # Create details grid as table
            table = doc.add_table(rows=3, cols=2)
            table.style = 'Light Grid Accent 1'
            
            details = [
                ('Grade Level', f"Grade {form_data.get('gradeLevel', '')}"),
                ('Subject', form_data.get('subject', '')),
                ('Strand', form_data.get('strand', '')),
                ('Topic', form_data.get('topic', '')),
                ('Duration', f"{form_data.get('duration', '')} minutes"),
                ('Date', form_data.get('date', ''))
            ]
            
            for idx, (label, value) in enumerate(details):
                row = idx // 2
                col = idx % 2
                cell = table.rows[row].cells[col]
                
                # Add label
                label_para = cell.paragraphs[0]
                label_run = label_para.add_run(f"{label}: ")
                label_run.font.bold = True
                label_run.font.size = Pt(10)
                label_run.font.color.rgb = RGBColor(100, 100, 100)
                
                # Add value
                value_run = label_para.add_run(value)
                value_run.font.size = Pt(10)
                value_run.font.color.rgb = RGBColor(50, 50, 50)
            
            # Add spacing after table
            doc.add_paragraph()
            doc.add_paragraph()
        
        # Parse and format content
        sections = parse_lesson_content_for_export(content)
        
        for section in sections:
            if section['type'] == 'details_grid':
                # Already handled above
                continue
            
            elif section['type'] == 'section':
                # Section heading
                heading = doc.add_heading(section['title'], level=1)
                heading_run = heading.runs[0]
                heading_run.font.color.rgb = RGBColor(*rgb)
                heading_run.font.size = Pt(18)
                
                # Add content
                for item in section.get('content', []):
                    if item['type'] == 'bullet':
                        para = doc.add_paragraph(item['text'], style='List Bullet')
                        para.paragraph_format.left_indent = Inches(0.25)
                        
                    elif item['type'] == 'nested_bullet':
                        para = doc.add_paragraph(item['text'], style='List Bullet 2')
                        para.paragraph_format.left_indent = Inches(0.5)
                        
                    elif item['type'] == 'numbered':
                        para = doc.add_paragraph(item['text'], style='List Number')
                        para.paragraph_format.left_indent = Inches(0.25)
                        
                    elif item['type'] == 'paragraph':
                        para = doc.add_paragraph(item['text'])
                        para.paragraph_format.space_after = Pt(6)
            
            elif section['type'] == 'field':
                # Field label
                field_heading = doc.add_heading(section['title'] + ':', level=2)
                field_run = field_heading.runs[0]
                field_run.font.color.rgb = RGBColor(int(rgb[0]*0.8), int(rgb[1]*0.8), int(rgb[2]*0.8))
                field_run.font.size = Pt(14)
                
                # Add content
                for item in section.get('content', []):
                    if item['type'] == 'bullet':
                        para = doc.add_paragraph(item['text'], style='List Bullet')
                        para.paragraph_format.left_indent = Inches(0.25)
                        
                    elif item['type'] == 'nested_bullet':
                        para = doc.add_paragraph(item['text'], style='List Bullet 2')
                        para.paragraph_format.left_indent = Inches(0.5)
                        
                    elif item['type'] == 'numbered':
                        para = doc.add_paragraph(item['text'], style='List Number')
                        para.paragraph_format.left_indent = Inches(0.25)
                        
                    elif item['type'] == 'paragraph':
                        para = doc.add_paragraph(item['text'])
                        para.paragraph_format.space_after = Pt(6)
        
        # If no structured sections found, just add the plain text
        if not sections and content:
            doc.add_paragraph(content)
        
        buf = io.BytesIO()
        doc.save(buf)
        return buf.getvalue()
        
    except Exception as e:
        raise RuntimeError(f"Failed to export DOCX: {e}")


def export_to_pdf(data: Union[str, Dict, List], title: str = "Export") -> bytes:
    """
    Export data to PDF format with rich formatting matching the webpage.
    """
    try:
        # Get formatting data
        if isinstance(data, dict):
            content = data.get('content', '')
            form_data = data.get('formData', {})
            accent_color = data.get('accentColor', '#3B82F6')
        else:
            content = str(data)
            form_data = {}
            accent_color = '#3B82F6'
        
        # Build HTML with inline CSS
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page {{
                    size: A4;
                    margin: 1.5cm;
                }}
                
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #374151;
                    margin: 0;
                    padding: 0;
                }}
                
                .header {{
                    background: linear-gradient(to bottom right, {accent_color}, {accent_color}dd, {accent_color}bb);
                    color: white;
                    padding: 2rem;
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                    position: relative;
                    overflow: hidden;
                }}
                
                .header::before {{
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 8rem;
                    height: 8rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                    transform: translate(50%, -50%);
                }}
                
                .subject-badge {{
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 1rem;
                }}
                
                .main-title {{
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                }}
                
                .subtitle {{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 1rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 0.875rem;
                }}
                
                .subtitle-item {{
                    display: flex;
                    align-items: center;
                }}
                
                .subtitle-item::before {{
                    content: '•';
                    margin-right: 0.5rem;
                    color: rgba(255, 255, 255, 0.7);
                }}
                
                .details-grid {{
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    background: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                }}
                
                .detail-item {{
                    font-size: 0.875rem;
                }}
                
                .detail-label {{
                    font-weight: 600;
                    color: #6b7280;
                }}
                
                .detail-value {{
                    color: #1f2937;
                    margin-left: 0.5rem;
                }}
                
                .section-heading {{
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: {accent_color}dd;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid {accent_color}33;
                }}
                
                .field-heading {{
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: {accent_color}cc;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }}
                
                .content p {{
                    margin: 0.75rem 0;
                    line-height: 1.7;
                }}
                
                .bullet-list {{
                    margin: 0.5rem 0;
                    padding-left: 0;
                    list-style: none;
                }}
                
                .bullet-list li {{
                    display: flex;
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                }}
                
                .bullet-list li::before {{
                    content: '•';
                    color: {accent_color}99;
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-right: 0.75rem;
                    flex-shrink: 0;
                }}
                
                .nested-bullet {{
                    margin-left: 2rem;
                }}
                
                .nested-bullet::before {{
                    content: '▸';
                    color: {accent_color}66;
                    font-size: 0.8em;
                }}
                
                .numbered-list {{
                    margin: 0.5rem 0;
                    padding-left: 0;
                    counter-reset: item;
                    list-style: none;
                }}
                
                .numbered-list li {{
                    display: flex;
                    margin-bottom: 0.75rem;
                    line-height: 1.6;
                }}
                
                .numbered-list li::before {{
                    counter-increment: item;
                    content: counter(item) ".";
                    color: {accent_color}cc;
                    font-weight: 600;
                    background: {accent_color}0d;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    margin-right: 0.75rem;
                    min-width: 2rem;
                    text-align: center;
                    flex-shrink: 0;
                }}
                
                .footer {{
                    margin-top: 3rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e5e7eb;
                    color: #9ca3af;
                    font-size: 0.75rem;
                    text-align: center;
                }}
            </style>
        </head>
        <body>
        """
        
        # Add header if form data exists
        if form_data:
            subject = form_data.get('subject', 'Mathematics')
            topic = form_data.get('topic', 'Lesson Plan')
            grade = form_data.get('gradeLevel', '')
            strand = form_data.get('strand', '')
            duration = form_data.get('duration', '')
            student_count = form_data.get('studentCount', '')
            
            html += f"""
            <div class="header">
                <div class="subject-badge">{subject}</div>
                <h1 class="main-title">Exploring {topic}</h1>
                <div class="subtitle">
                    <span class="subtitle-item">Grade {grade}</span>
                    <span class="subtitle-item">{strand}</span>
                    <span class="subtitle-item">{duration} minutes</span>
                    <span class="subtitle-item">{student_count} students</span>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Grade Level:</span>
                    <span class="detail-value">Grade {grade}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Subject:</span>
                    <span class="detail-value">{subject}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Strand:</span>
                    <span class="detail-value">{strand}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Topic:</span>
                    <span class="detail-value">{topic}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">{duration} minutes</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">{form_data.get('date', 'N/A')}</span>
                </div>
            </div>
            """
        
        # Parse and add content
        html += '<div class="content">'
        
        sections = parse_lesson_content_for_export(content)
        
        for section in sections:
            if section['type'] == 'details_grid':
                continue  # Already handled above
            
            elif section['type'] == 'section':
                html += f'<h2 class="section-heading">{section["title"]}</h2>'
                html += format_section_content_html(section.get('content', []))
            
            elif section['type'] == 'field':
                html += f'<h3 class="field-heading">{section["title"]}:</h3>'
                html += format_section_content_html(section.get('content', []))
        
        # If no structured sections found, just add plain text
        if not sections and content:
            html += f'<pre style="white-space: pre-wrap; font-family: inherit;">{content}</pre>'
        
        html += '</div>'
        
        # Add footer
        from datetime import datetime
        html += f"""
            <div class="footer">
                Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
            </div>
        </body>
        </html>
        """
        
        pdf_bytes = HTML(string=html).write_pdf()
        return pdf_bytes
        
    except Exception as e:
        raise RuntimeError(f"Failed to export PDF: {e}")


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