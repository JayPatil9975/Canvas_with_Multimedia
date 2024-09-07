const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /mp4|webm|ogg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!');
    }
}

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static('./public'));
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'No file selected!'
                });
            } else {
                res.render('index', {
                    msg: 'File uploaded successfully!',
                    file: `/uploads/${req.file.filename}`
                });
            }
        }
    });
});

// Home route
app.get('/', (req, res) => res.render('index'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
