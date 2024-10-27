const express = require('express');
const path = require('path');

const webserver = express();

webserver.use(express.json());
webserver.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

module.exports = { webserver };
