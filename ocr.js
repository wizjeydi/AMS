/ ocr.js
// OCR Processing

export function processOCR() {
    const outputText = document.getElementById('output-text');
    const processBtn = document.querySelector('.process-btn');
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }
    processBtn.textContent = 'Processing...';
    processBtn.disabled = true;
    outputText.innerHTML = '<p class="placeholder-text">Processing image...</p>';
    if (file.type.startsWith('image/')) {
        runTesseractOCR(file, outputText, processBtn);
    } else if (file.type === 'application/pdf') {
        outputText.innerHTML = '<p class="placeholder-text">PDF processing requires server-side OCR implementation. Please convert PDF to image or implement server-side processing.</p>';
        processBtn.textContent = 'Process OCR';
        processBtn.disabled = false;
    } else {
        outputText.innerHTML = '<p class="placeholder-text">Unsupported file type. Please upload an image file.</p>';
        processBtn.textContent = 'Process OCR';
        processBtn.disabled = false;
    }
}

export function runTesseractOCR(file, outputText, processBtn) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            Tesseract.recognize(
                img,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            outputText.innerHTML = `<p class=\"placeholder-text\">Recognizing text... ${Math.round(m.progress * 100)}%</p>`;
                        }
                    }
                }
            ).then(({ data: { text } }) => {
                if (text.trim()) {
                    outputText.innerHTML = `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
                } else {
                    outputText.innerHTML = '<p class=\"placeholder-text\">No text found in the image. Please try a different image with clearer text.</p>';
                }
                processBtn.textContent = 'Process OCR';
                processBtn.disabled = false;
            }).catch(error => {
                console.error('OCR Error:', error);
                outputText.innerHTML = '<p class=\"placeholder-text\">Error processing image. Please try again.</p>';
                processBtn.textContent = 'Process OCR';
                processBtn.disabled = false;
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
} 