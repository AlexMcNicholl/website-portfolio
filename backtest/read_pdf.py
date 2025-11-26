from pypdf import PdfReader

reader = PdfReader("backtest/strategy_doc.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

print(text[:3000])
