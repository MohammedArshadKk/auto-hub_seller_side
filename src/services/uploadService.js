import api from './api';
import axios from 'axios';

/**
 * Service for handling file uploads via S3 pre-signed URLs
 */
export const uploadService = {
    /**
     * Uploads a file to S3 using a pre-signed URL
     * @param {File} file - The file object to upload
     * @returns {Promise<string>} - The final image URL
     */
    uploadToS3: async (file) => {
        try {
            // 1. Get pre-signed URL from our backend
            const { data } = await api.post('/upload/presigned-url', {
                filename: file.name,
                contentType: file.type,
                fileSize: file.size
            });

            const { uploadUrl, imageUrl } = data.data;

            // 2. Upload directly to S3
            // We use a clean axios instance here to avoid our interceptors 
            // and auth headers which S3 will reject
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            return imageUrl;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw error; // Use normalized error from api.js or re-throw
        }
    },

    /**
     * Uploads multiple files to S3
     * @param {File[]} files - Array of file objects
     * @returns {Promise<string[]>} - Array of final image URLs
     */
    uploadMultipleToS3: async (files) => {
        const uploadPromises = files.map(item => {
            // Extract file if it's the UI object structure { file, preview }
            const file = item.file || item;

            // If it's already a URL (existing image), skip upload
            if (typeof file === 'string' && (file.startsWith('http') || file.startsWith('https'))) {
                return Promise.resolve(file);
            }
            return uploadService.uploadToS3(file);
        });
        return Promise.all(uploadPromises);
    }
};
