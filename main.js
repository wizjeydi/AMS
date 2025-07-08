// main.js
// Entry point: imports and initialization
import { handleFileInputChange, handleUploadAreaClick, handleUploadAreaDragOver, handleUploadAreaDragLeave, handleUploadAreaDrop } from './upload.js';
import { processOCR } from './ocr.js';
import { convertToPDF } from './pdf.js';
import { copyOutput } from './copy.js';
import { showOCRContent, showDashboardContent, hideFeatureContent, addCardHoverEffects, addTypingEffect, setupNavigation, showMessage } from './ui.js';

function init() {
    // File upload events
    document.getElementById('file-input').addEventListener('change', handleFileInputChange);
    document.getElementById('upload-area').addEventListener('click', handleUploadAreaClick);
    document.getElementById('upload-area').addEventListener('dragover', handleUploadAreaDragOver);
    document.getElementById('upload-area').addEventListener('dragleave', handleUploadAreaDragLeave);
    document.getElementById('upload-area').addEventListener('drop', handleUploadAreaDrop);
    // OCR
    document.querySelector('.process-btn').onclick = processOCR;
    // PDF
    document.querySelector('.pdf-btn').onclick = convertToPDF;
    // Copy
    document.querySelector('.copy-btn').onclick = copyOutput;
    // Feature content
    window.showOCRContent = showOCRContent;
    window.showDashboardContent = showDashboardContent;
    window.hideFeatureContent = hideFeatureContent;
    // UI effects
    addCardHoverEffects();
    addTypingEffect();
    // Navigation
    setupNavigation();
    // Hero button
    window.showMessage = showMessage;
}

document.addEventListener('DOMContentLoaded', init);