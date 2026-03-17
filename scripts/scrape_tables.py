"""
Extract tables from curriculum PDFs to find SCOs.
Test with one PDF first.
"""
import pdfplumber
import re
import os

PDF_DIR = r"C:\Users\LG\Desktop\Projects\Offline AI Standalone\Delon Curriculum Docs"

def test_table_extraction(pdf_name):
    pdf_path = os.path.join(PDF_DIR, pdf_name)
    print(f"\n=== Testing: {pdf_name} ===")

    with pdfplumber.open(pdf_path) as pdf:
        print(f"Pages: {len(pdf.pages)}")

        for i, page in enumerate(pdf.pages[:20]):  # First 20 pages
            tables = page.extract_tables()
            if tables:
                print(f"\n--- Page {i+1}: {len(tables)} table(s) ---")
                for t_idx, table in enumerate(tables):
                    print(f"  Table {t_idx+1}: {len(table)} rows x {len(table[0]) if table else 0} cols")
                    for row_idx, row in enumerate(table[:5]):  # First 5 rows
                        cleaned = [str(cell)[:60] if cell else "" for cell in row]
                        print(f"    Row {row_idx}: {cleaned}")

# Test with Grade 2 social studies (simpler format)
test_table_extraction("grade2-social-studies-curriculum.pdf")
