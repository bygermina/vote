const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

const removeExtension = (filePath) => {
    return filePath.replace(/\.[^/.]+$/, '');
};

const createZipFilePath = (filePath) => {
    const pathWithoutExtension = removeExtension(filePath);

    const zipFilePath = pathWithoutExtension + '.zip';

    return zipFilePath;
}

const findAllFilesInFolder = async (dir, fileRegex, actOverFile) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fullPath = path.join(dir, file.name);

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
    const gzip = zlib.createGzip();
    const source = fs.createReadStream(sourceFilePath);
    const destination = fs.createWriteStream(zipFilePath);

    try {
        await pipeline(source, gzip, destination);
        console.log(`Zip file created: ${zipFilePath}`);
    } catch (error) {
        throw error;
    }
};

module.exports = { createZipFile, findAllFilesInFolder, checkFileExistsAndValid, createZipFilePath };
