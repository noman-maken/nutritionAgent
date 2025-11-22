import axios from 'axios';

const upload_url = process.env.NEXT_PUBLIC_MEDIA_SITE_URL;
const uploadFile = async (directory, files) => {
    const formData = new FormData();

    if (Array.isArray(files)) {
        files.forEach((file) => formData.append('files', file));
    } else {
        formData.append('files', files);
    }

    const finalDirectory = process.env.NODE_ENV === "development" ? "development" : directory;

    try {
        const response = await axios.post(`${upload_url}?directory=${finalDirectory}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to upload images:', error);
        throw error;
    }
};

export default uploadFile;
