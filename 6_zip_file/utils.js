const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

const removeExtension = (filePath) => {
    return filePath.replace(/\.[^/.]+$/, '');
};

const createZipFilePath = (filePath) => {
    const pathWithoutExtension = removeExtension(filePath);

    return pathWithoutExtension + '.zip';
}

const findAllFilesInFolder = async (dir, fileRegex, actOverFile) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        console.log('проверяем путь:', fullPath);

        if (file.isDirectory()) {
            await findAllFilesInFolder(fullPath, fileRegex, actOverFile);
        } else {
            if (fileRegex.test(file.name)) {
                continue;
            }

            await actOverFile(fullPath);
        }
    }
};

const checkFileExistsAndValid = async (sourceFilePath, comparefilePath) => {
    const sourceStats = await fs.promises.stat(sourceFilePath);
    let fileStats;

    try {
        fileStats = await fs.promises.stat(comparefilePath);
    } catch (err) {
    } finally {
        if (!fileStats || (sourceStats.mtime > fileStats.mtime)) {
            return true;
        }
    }

    return false;
}

const createZipFile = async (sourceFilePath, zipFilePath) => {
    const source = fs.createReadStream(sourceFilePath);
    const gzip = zlib.createGzip();
    const destination = fs.createWriteStream(zipFilePath);

    console.log('архив начал:', zipFilePath);
    try {
        await pipeline(source, gzip, destination);
        console.log(`архив создан: ${zipFilePath}`);
    } catch (error) {
        throw error;
    }
};

module.exports = { createZipFile, findAllFilesInFolder, checkFileExistsAndValid, createZipFilePath };
