const shortid = require('shortid');
const multer = require('multer');
const path = require('path');

// Formatos permitidos (mimetype -> extensión con la que se guarda el archivo)
const formatosPermitidos = {
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/pjpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'application/pdf': 'pdf'
};

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/'));
        },
        filename: (req, file, cb) => {
            // Genera un nombre único usando shortid y le concatena la extensión según su formato
            const extension = formatosPermitidos[file.mimetype];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (formatosPermitidos[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'));
        }
    },


}
module.exports = configuracionMulter;