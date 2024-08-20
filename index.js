/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
// import inquirer from 'inquirer';
// import qr from 'qr-image';
// import fs from 'fs';

// inquirer
//   .prompt([
//     {

//         message: "Type in your url",
//         name:"URL",

//     },
    
//   ])
//   .then((answers) => {

//     const url = answers.URL;
//     var qr_svg = qr.image(url);
//     qr_svg.pipe(fs.createWriteStream('qr_img.png'));

//     fs.writeFile('URL.txt', url, (err) => {
//         if (err) throw err;
//         console.log('The file has been saved!');
//       }); 
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
      
//     } else {
      
//     }
//   });

import express from 'express';
import path from 'path';
import qr from 'qr-image';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create the Express app
const app = express();
const port = 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to generate QR code
app.post('/generate', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  // Generate a unique filename based on timestamp
  const timestamp = new Date().getTime();
  const imagePath = path.join(__dirname, 'public', `qr_img_${timestamp}.png`);
  
  // Generate QR code
  const qr_svg = qr.image(url, { type: 'png' });
  qr_svg.pipe(fs.createWriteStream(imagePath))
    .on('finish', () => res.send({ imageUrl: `/qr_img_${timestamp}.png` }))
    .on('error', (err) => res.status(500).send('Error generating QR code'));
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
