const API_BASE_URL = 'https://i-backend-nve4.onrender.com/api';

export const api = {
    // Upload file
    async uploadFile(file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload?makePublic=${options.makePublic || false}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    // Upload multiple files
    async uploadMultiple(files, options = {}) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`${API_BASE_URL}/upload/multiple?makePublic=${options.makePublic || false}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    // List files
    async listFiles() {
        const response = await fetch(`${API_BASE_URL}/files`);

        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        return response.json();
    },

    // Search files
    async searchFiles(query) {
        const response = await fetch(`${API_BASE_URL}/files/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Search failed');
        }

        return response.json();
    },

    // Get file details
    async getFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`);

        if (!response.ok) {
            throw new Error('Failed to get file');
        }

        return response.json();
    },

    // Delete file
    async deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete file');
        }

        return response.json();
    },

    // Make file public
    async makePublic(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}/public`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Failed to make file public');
        }

        return response.json();
    },

    // Create folder
    async createFolder(folderName, parentId = null) {
        const response = await fetch(`${API_BASE_URL}/folders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ folderName, parentId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create folder');
        }

        return response.json();
    },
};

export default api;
