const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = (file, options) => {
  return cloudinary.uploader.upload(file.tempFilePath, options);
};

const destroy = cloudinary.uploader.destroy;

module.exports = { cloudinary, upload, destroy };
