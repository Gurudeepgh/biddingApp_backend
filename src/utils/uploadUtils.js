const path = require('path');
const fs = require('fs');

const uploadImage = async (file) => {
  const uploadDir = 'uploads/'; // Specify the desired upload directory

  // Create the upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Generate a unique filename for the uploaded image
  const extension = path.extname(file.originalname);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const uploadPath = path.join(uploadDir, filename);

  // Move the uploaded file to the upload directory
  await new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // Return the path to the uploaded image
  return `/${uploadPath}`;
};

module.exports = { uploadImage };