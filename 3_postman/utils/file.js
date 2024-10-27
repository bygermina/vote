const fs = require('fs');
const path = require('path');

class File {
    constructor(path) {
        this.path = path;
    }

    read() {
        return JSON.parse(fs.readFileSync(this.path, 'utf8'));
    }

    write(data) {
        fs.writeFileSync(this.path, JSON.stringify(data));
    }
}

class RequestsFile extends File {
    constructor() {
        const pathRequests = path.join(__dirname, '../_requests.log');

        super(pathRequests);

        if (!fs.existsSync(pathRequests)) {
            this.write([]);
        }
    }
}

module.exports = { RequestsFile };
