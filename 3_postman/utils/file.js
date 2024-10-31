const fs = require('fs');
const path = require('path');

class File {
    constructor(relPath) {
        const fullPath = path.join(__dirname, ...relPath);

        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, JSON.stringify([]));
        }

        this.path = fullPath;
    }

    read() {
        return JSON.parse(fs.readFileSync(this.path, 'utf8'));
    }

    write(data) {
        fs.writeFileSync(this.path, JSON.stringify(data));
    }
}

module.exports = { File };
