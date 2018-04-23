const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname)
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const limits = {
	fileSize: 1024 * 1024 * 5
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits })

module.exports = upload;