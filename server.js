const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, //Filesize maximum 10 Megabytes.
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('imageUpload');

//Check upload file type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpe?g|jpg|png|gif|bmp/;
    // Check extensions against file
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check file mimetype
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Uploaded file must be an image.');
    }
}

// Init app
const app = express();

// Set view engine to 'ejs'
app.set('view engine', 'ejs');

// Public directory
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

// Create 'uploads' route
app.post('/uploads', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No file selected.'
                });
            } else {
                res.render('index', {
                    msg: 'Success: File uploaded.',
                    file: `uploads/${req.file.filename}`,
                });
                console.log("==> POST EVENT:");
                console.log(req.file);
            }
        }
    });
});

const port = process.env.PORT || "3000";

app.listen(port, () => {
    console.log(`Server is listening to requests on http://localhost:${port}...`);
});
