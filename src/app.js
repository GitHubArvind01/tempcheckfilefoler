const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { removeBackgroundFromImageFile } = require('remove.bg');

const app = express();  // Define the app variable
const port = 4000;

// Setup multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files (like index.html) from the "public" folder
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.post('/remove-bg', upload.single('image'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `output/${req.file.originalname}`;
  
    removeBackgroundFromImageFile({
      path: inputPath,
      apiKey: 'enjSGBkjpw4wnPjBegfVjkKW',  // Replace with your remove.bg API key
      size: 'auto',
      type: 'auto',
    })
      .then((result) => {
        const outputBase64 = result.base64img;
  
        // Convert base64 to Buffer and save the file
        const buffer = Buffer.from(outputBase64, 'base64');
        fs.writeFileSync(outputPath, buffer);
  
        // Send the processed image to the client
        res.download(outputPath, (err) => {
          if (err) {
            console.error(err);
          }
  
          // Clean up the files after sending
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error removing background');
      });
  });
  