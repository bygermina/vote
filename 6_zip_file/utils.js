const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

const zipFileRegex = /\.zip$/;

const findFileAndCreateZip = async (dir) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            await findFileAndCreateZip(fullPath);
        } else {
            if (zipFileRegex.test(file.name)) {
                continue;
            }

            const parsedPath = path.parse(file.name);
            const zipFilePath = path.join(dir, `${parsedPath.name}.zip`);

            const sourceStats = await fs.promises.stat(fullPath);
            let zipStats;

            try {
                zipStats = await fs.promises.stat(zipFilePath);
            } catch (err) {
            } finally {
                if (!zipStats || (sourceStats.mtime > zipStats.mtime)) {
                    console.log(`Creating or updating zip for: ${file.name}`);
                    await createZipFile(fullPath, zipFilePath);
                }
            }
        }
    }
};

const createZipFile = async (sourceFile, zipFilePath) => {
    const gzip = zlib.createGzip();
    const source = fs.createReadStream(sourceFile);
    const destination = fs.createWriteStream(zipFilePath);

    try {
        await pipeline(source, gzip, destination);
        console.log(`Zip file created: ${zipFilePath}`);
    } catch (error) {
        console.error(`Error creating zip file: ${error.message}`);
        throw error;
    }
};

module.exports = { findFileAndCreateZip, createZipFile };
