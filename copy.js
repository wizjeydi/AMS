// copy.js
// Copy to Clipboard

export function copyOutput() {
    const outputText = document.getElementById('output-text');
    const text = outputText.innerText;
    if (text && text !== 'Upload an image to extract text...' && text !== 'Processing image...') {
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#059669';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#ea580c';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text to clipboard');
        });
    }
} 

