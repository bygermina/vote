const path = require('path');

class PageController {
    getPage = (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "public", "page.html"));
    }
}

module.exports = new PageController();
