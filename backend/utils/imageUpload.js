const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const uploadImage = async (file, folder = 'lost-and-found') => {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME === 'your_cloudinary_name') {
      // Use local file storage for development
      return uploadImageLocally(file, folder);
    }

    // Use Cloudinary if configured
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: folder,
      resource_type: 'auto',
      width: 500,
      height: 500,
      crop: 'fill',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to local storage
    return uploadImageLocally(file, folder);
  }
};

const uploadImageLocally = async (file, folder = 'lost-and-found') => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../public/uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Copy file from temp location
    fs.copyFileSync(file.tempFilePath, filepath);

    // Return URL path
    const url = `/uploads/${folder}/${filename}`;
    console.log('Image stored locally:', url);

    return {
      url,
      publicId: filename,
      local: true,
    };
  } catch (error) {
    throw new Error(`Local image upload failed: ${error.message}`);
  }
};

const deleteImage = async (publicId) => {
  try {
    // Don't delete local images - just return success
    if (!publicId) return;
    console.log('Image delete not implemented for local storage');
  } catch (error) {
    console.error(`Failed to delete image: ${error.message}`);
  }
};

module.exports = { uploadImage, deleteImage };

