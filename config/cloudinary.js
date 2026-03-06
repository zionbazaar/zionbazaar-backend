const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error('❌ Cloudinary Error: Missing environment variables. Check your Render Dashboard!');
        console.error('Missing:', [
            !cloudName && 'CLOUDINARY_CLOUD_NAME',
            !apiKey && 'CLOUDINARY_API_KEY',
            !apiSecret && 'CLOUDINARY_API_SECRET'
        ].filter(Boolean).join(', '));
    } else {
        console.log('✅ Cloudinary Configured Successfully');
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
};

module.exports = configureCloudinary;
