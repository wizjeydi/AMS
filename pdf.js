// pdf.js
// PDF Generation

export function convertToPDF() {
    const outputText = document.getElementById('output-text');
    const text = outputText.innerText;
    if (text && text !== 'Upload an image to extract text...' && text !== 'Processing image...') {
        const pdfBtn = document.querySelector('.pdf-btn');
        const originalText = pdfBtn.textContent;
        pdfBtn.textContent = 'Generating...';
        pdfBtn.disabled = true;
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const red = '#b91c1c';
            const gray = '#6b7280';
            const borderRadius = 16;
            // Header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(red);
            doc.text('Athlete Monitoring System', pageWidth / 2, 60, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(gray);
            doc.text('OCR Document Report', pageWidth / 2, 85, { align: 'center' });
            // Main Content Box
            const boxX = 40;
            const boxY = 120;
            const boxW = pageWidth - 80;
            let boxH = 400;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor('#222');
            doc.text('Extracted Text:', boxX + 20, boxY + 30);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor('#222');
            const textLines = doc.splitTextToSize(text, boxW - 40);
            let textY = boxY + 55;
            const lineHeight = 16;
            textLines.forEach(line => {
                if (textY > pageHeight - 100) {
                    doc.addPage();
                    textY = 60;
                }
                doc.text(line, boxX + 20, textY);
                textY += lineHeight;
            });
            boxH = Math.max(100, textY - boxY + 20);
            doc.setDrawColor(red);
            doc.setLineWidth(2);
            doc.roundedRect(boxX, boxY, boxW, boxH, borderRadius, borderRadius);
            // Footer
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(gray);
            const footerLeft = 'Batangas State University TNEU ARASOF - Nasugbu\nAthlete Monitoring System';
            const now = new Date();
            const dateStr = now.toLocaleDateString();
            const timeStr = now.toLocaleTimeString();
            const footerRight = `Generated on: ${dateStr}, ${timeStr}`;
            doc.text(footerLeft, boxX, pageHeight - 40);
            doc.text(footerRight, pageWidth - boxX, pageHeight - 25, { align: 'right' });
            const fileName = `OCR_Extracted_Text_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}-${now.getSeconds().toString().padStart(2,'0')}.pdf`;
            doc.save(fileName);
            pdfBtn.textContent = 'PDF Created!';
            pdfBtn.style.background = '#059669';
            setTimeout(() => {
                pdfBtn.textContent = originalText;
                pdfBtn.style.background = '#059669';
                pdfBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Error generating PDF. Please try again.');
            pdfBtn.textContent = originalText;
            pdfBtn.disabled = false;
        }
    } else {
        alert('No text available to convert to PDF. Please process an image first.');
    }
} 