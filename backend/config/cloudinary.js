const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Helper function to upload file to Cloudinary from buffer (multer memory storage)
const uploadToCloudinary = async (fileBuffer, originalName, folder = 'medical_docs') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        public_id: originalName.split('.')[0] + '_' + Date.now()
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject({
            success: false,
            error: error.message
          });
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            size: result.bytes,
            width: result.width || null,
            height: result.height || null,
            resource_type: result.resource_type
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to generate signed URL for secure access
const generateSignedUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      ...options
    };

    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Cloudinary signed URL error:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  generateSignedUrl
};
