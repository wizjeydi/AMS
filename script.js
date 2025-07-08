// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Button click handler
function showMessage() {
    alert('Welcome! This is your simple web interface. Feel free to explore!');
}

// Feature content handlers
function showOCRContent() {
    document.getElementById('ocr-content').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';
    // Smooth scroll to the content
    document.getElementById('ocr-content').scrollIntoView({ behavior: 'smooth' });
}

function showDashboardContent() {
    document.getElementById('dashboard-content').style.display = 'block';
    document.getElementById('ocr-content').style.display = 'none';
    // Smooth scroll to the content
    document.getElementById('dashboard-content').scrollIntoView({ behavior: 'smooth' });
}

function hideFeatureContent() {
    document.getElementById('ocr-content').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'none';
}

// =========================
// File Upload & Preview
// =========================
function handleFileInputChange(e) {
    const file = e.target.files[0];
    if (file) {
        showFileInfo(file);
        showImagePreview(file);
    }
}

function handleUploadAreaClick() {
    document.getElementById('file-input').click();
}

function handleUploadAreaDragOver(e) {
    e.preventDefault();
    document.getElementById('upload-area').classList.add('dragover');
}

function handleUploadAreaDragLeave(e) {
    e.preventDefault();
    document.getElementById('upload-area').classList.remove('dragover');
}

function handleUploadAreaDrop(e) {
    e.preventDefault();
    document.getElementById('upload-area').classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        document.getElementById('file-input').files = files;
        showFileInfo(file);
        showImagePreview(file);
    }
}

function showFileInfo(file) {
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-info').style.display = 'block';
    document.getElementById('upload-area').style.display = 'none';
}

function showImagePreview(file) {
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
    }
}

// =========================
// OCR Processing
// =========================
function processOCR() {
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

function runTesseractOCR(file, outputText, processBtn) {
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
                            outputText.innerHTML = `<p class="placeholder-text">Recognizing text... ${Math.round(m.progress * 100)}%</p>`;
                        }
                    }
                }
            ).then(({ data: { text } }) => {
                if (text.trim()) {
                    outputText.innerHTML = `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
                } else {
                    outputText.innerHTML = '<p class="placeholder-text">No text found in the image. Please try a different image with clearer text.</p>';
                }
                processBtn.textContent = 'Process OCR';
                processBtn.disabled = false;
            }).catch(error => {
                console.error('OCR Error:', error);
                outputText.innerHTML = '<p class="placeholder-text">Error processing image. Please try again.</p>';
                processBtn.textContent = 'Process OCR';
                processBtn.disabled = false;
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// =========================
// Copy Output
// =========================
function copyOutput() {
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

// =========================
// PDF Generation
// =========================
function convertToPDF() {
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

// =========================
// UI Effects & Typing
// =========================
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 500);
    }
}

// =========================
// Navigation & Scroll
// =========================
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// =========================
// Initialization
// =========================
function init() {
    // File upload events
    document.getElementById('file-input').addEventListener('change', handleFileInputChange);
    document.getElementById('upload-area').addEventListener('click', handleUploadAreaClick);
    document.getElementById('upload-area').addEventListener('dragover', handleUploadAreaDragOver);
    document.getElementById('upload-area').addEventListener('dragleave', handleUploadAreaDragLeave);
    document.getElementById('upload-area').addEventListener('drop', handleUploadAreaDrop);
    // UI effects
    addCardHoverEffects();
    addTypingEffect();
    // Navigation
    setupNavigation();
}

document.addEventListener('DOMContentLoaded', init);

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .content-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(callback, file.type);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
} 