const path = require('path');

const { findFileAndCreateZip } = require('./utils.js');

findFileAndCreateZip(path.join(__dirname, 'someFolder'));
