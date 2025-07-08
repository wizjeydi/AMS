// upload.js
// File Upload & Preview

export function handleFileInputChange(e) {
    const file = e.target.files[0];
    if (file) {
        showFileInfo(file);
        showImagePreview(file);
    }
}

export function handleUploadAreaClick() {
    document.getElementById('file-input').click();
}

export function handleUploadAreaDragOver(e) {
    e.preventDefault();
    document.getElementById('upload-area').classList.add('dragover');
}

export function handleUploadAreaDragLeave(e) {
    e.preventDefault();
    document.getElementById('upload-area').classList.remove('dragover');
}

export function handleUploadAreaDrop(e) {
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

export function showFileInfo(file) {
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-info').style.display = 'block';
    document.getElementById('upload-area').style.display = 'none';
}

export function showImagePreview(file) {
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