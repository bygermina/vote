const express = require('express');
const path = require('path');

const pageController = require('./controllers/page');
const requestController = require('./controllers/request');

const webserver = express();

webserver.use(express.json());
webserver.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;

webserver.listen(PORT, () => {
    console.log("web server running on port " + PORT);
});

webserver.get('/page', pageController.getPage);

webserver.get('/getRequests', requestController.getRequests);
webserver.post('/sendRequest', requestController.sendRequest);
webserver.post('/saveRequest', requestController.saveRequest);
