import { useState, useRef } from 'react';
import './Upload.css';

const API_URL = 'https://i-backend-nve4.onrender.com/api';

const CATEGORIES = [
    { value: '', label: 'Select category' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Music', label: 'Music' },
    { value: 'Movies', label: 'Movies' },
    { value: 'Live', label: 'Live' },
    { value: 'Tech', label: 'Technology' },
    { value: 'Sports', label: 'Sports' },
    { value: 'News', label: 'News' },
];

export default function Upload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        visibility: 'public',
    });

    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        dropZoneRef.current?.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        dropZoneRef.current?.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dropZoneRef.current?.classList.remove('drag-over');
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setError(null);
        setUploadResult(null);

        // Create preview
        if (selectedFile.type.startsWith('video/')) {
            const url = URL.createObjectURL(selectedFile);
            setPreview({ type: 'video', url });
        } else if (selectedFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setPreview({ type: 'image', url });
        } else {
            setPreview({ type: 'file', name: selectedFile.name });
        }

        // Auto-fill title from filename
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, title: fileName }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
        setUploadResult(null);
        setFormData({ title: '', description: '', category: '', visibility: 'public' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        if (!formData.title.trim()) {
            setError('Please enter a title');
            return;
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        const uploadData = new FormData();

        // Create a new file with category prefix in name for filtering
        const category = formData.category || 'General';
        const extension = file.name.split('.').pop();
        const baseName = formData.title || file.name.replace(/\.[^/.]+$/, '');
        const newFileName = `[${category}] ${baseName}.${extension}`;

        const renamedFile = new File([file], newFileName, { type: file.type });
        uploadData.append('file', renamedFile);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch(`${API_URL}/upload?makePublic=true`, {
                method: 'POST',
                body: uploadData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            setUploadResult(result.data);

        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUploadAnother = () => {
        handleRemoveFile();
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                {/* Header */}
                <header className="page-header">
                    <h1>📤 Upload Video</h1>
                    <p>Share your content with the world and earn when others watch!</p>
                </header>

                {/* Upload Form */}
                <div className="upload-form">
                    {/* Success State */}
                    {uploadResult ? (
                        <div className="upload-success">
                            <div className="success-icon">✅</div>
                            <h2>Upload Complete!</h2>
                            <p>Your file has been uploaded to Google Drive</p>
                            <div className="success-details">
                                <div className="detail-item">
                                    <span className="label">File Name:</span>
                                    <span className="value">{uploadResult.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Size:</span>
                                    <span className="value">{formatFileSize(parseInt(uploadResult.size))}</span>
                                </div>
                            </div>
                            <div className="success-links">
                                <a
                                    href={uploadResult.webViewLink}
                                    className="success-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>👁️</span> View on Drive
                                </a>
                                <button className="success-btn" onClick={handleUploadAnother}>
                                    Upload Another
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Drop Zone */}
                            <div
                                className={`drop-zone ${file ? 'has-file' : ''}`}
                                ref={dropZoneRef}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !file && fileInputRef.current?.click()}
                            >
                                {!file ? (
                                    <div className="drop-content">
                                        <div className="upload-icon">📁</div>
                                        <h3>Drag and drop your file here</h3>
                                        <p>or</p>
                                        <button className="browse-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}>
                                            Browse Files
                                        </button>
                                        <span className="file-info">Supports: MP4, MOV, AVI, Images (Max 50MB)</span>
                                    </div>
                                ) : (
                                    <div className="drop-preview">
                                        {preview?.type === 'video' && (
                                            <video src={preview.url} controls />
                                        )}
                                        {preview?.type === 'image' && (
                                            <img src={preview.url} alt="Preview" />
                                        )}
                                        {preview?.type === 'file' && (
                                            <div className="file-preview">
                                                <span className="file-icon">📄</span>
                                                <span>{preview.name}</span>
                                            </div>
                                        )}
                                        <div className="file-details">
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">{formatFileSize(file.size)}</span>
                                        </div>
                                        <button className="remove-file-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile();
                                        }}>
                                            ✕ Remove
                                        </button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*,image/*"
                                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                                    hidden
                                />
                            </div>

                            {/* Video Details Form */}
                            {file && (
                                <div className="video-details">
                                    <div className="form-group">
                                        <label htmlFor="title">Title *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter video title"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Describe your video..."
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="category">Category</label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="visibility">Visibility</label>
                                            <select
                                                id="visibility"
                                                name="visibility"
                                                value={formData.visibility}
                                                onChange={handleInputChange}
                                            >
                                                <option value="public">Public</option>
                                                <option value="unlisted">Unlisted</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="error-message">
                                            ❌ {error}
                                        </div>
                                    )}

                                    {/* Upload Progress */}
                                    {uploading && (
                                        <div className="upload-progress">
                                            <div className="progress-header">
                                                <span>Uploading to Google Drive...</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="form-actions">
                                        <button className="cancel-btn" onClick={handleRemoveFile}>
                                            Cancel
                                        </button>
                                        <button
                                            className="upload-btn"
                                            onClick={handleUpload}
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Uploading...' : '⬆️ Upload Video'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Tips */}
                <div className="tips-section">
                    <h3>💡 Upload Tips</h3>
                    <div className="tips-grid">
                        <div className="tip">
                            <span className="tip-icon">📐</span>
                            <p>Use 16:9 aspect ratio for best results</p>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🎬</span>
                            <p>Add an engaging title and description</p>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🏷️</span>
                            <p>Use relevant tags for better discoverability</p>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">📷</span>
                            <p>Files are stored securely in Google Drive</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
