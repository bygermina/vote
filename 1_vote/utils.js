const fs = require('fs');
const path = require('path');

const { variants } = require('./constants');

const statistics = variants.reduce((acc, variant) => {
    acc[variant.id] = 0;

    return acc;
}, {});

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

class StatisticsFile extends File {
    constructor() {
        const pathStatistics = path.join(__dirname, '_statistics.log');

        super(pathStatistics);

        if (!fs.existsSync(pathStatistics)) {
            this.write(statistics);
        }
    }
}

module.exports = { StatisticsFile };
