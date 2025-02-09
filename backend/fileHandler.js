import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
const uploadDir = './uploads';

export async function checkAndCreateDir() {
    try {
        await fs.access(uploadDir);
    } catch (err) {
        await fs.mkdir(uploadDir);
    }
}

export async function readFileContent(file) {
    console.log(file);
    const filePath = path.join('./uploads', file.filename);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
    } catch (error) {
        console.error("Error reading file:", error);
        throw new Error("Failed to read the file");
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage, limits: { fileSize: Infinity } });

export default upload;