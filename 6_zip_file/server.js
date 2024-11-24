const path = require('path');

const { createZipFile, findAllFilesInFolder, checkFileExistsAndValid, createZipFilePath } = require('./utils.js');

const zipFileRegex = /\.zip$/

const findFileAndCreateZip = async () => {
    const initialFolder = path.join(__dirname, 'someFolder');

    const actOverFile = async (fullPath) => {
        const zipFilePath = createZipFilePath(fullPath);
        const notExistOrUnvalid = await checkFileExistsAndValid(fullPath, zipFilePath);

        if (notExistOrUnvalid) {
            await createZipFile(fullPath, zipFilePath);
        }
    }

    await findAllFilesInFolder(initialFolder, zipFileRegex, actOverFile);
}

findFileAndCreateZip();
