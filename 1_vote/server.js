const express = require('express');
const path = require('path');

const { variants, header } = require('./constants');
const { StatisticsFile } = require('./utils/file');
const { getDataBaseOnHeader, getContentHeader } = require('./utils/responseUtils');

const webserver = express();

webserver.use(express.json());
webserver.use(express.static(path.join(__dirname, 'public')));

const statisticsInstance = new StatisticsFile();

const PORT = process.env.NODE_ENV === "development" ? 3050 : 22;

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/page', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "page.html"));
});

webserver.get('/variants', (req, res) => {
    res.send(variants);
});

webserver.post('/vote', (req, res) => {
    const variantId = req.body.variantId;

    if (variantId) {
        const statistics = statisticsInstance.read();
        statistics[variantId] += 1;

        statisticsInstance.write(statistics);
        res.send({ success: true });
    }
});

webserver.post('/stat', (req, res) => {
    const clientAccept = req.headers.accept;
    const statistics = statisticsInstance.read();
   
    const contentHeader = getContentHeader(clientAccept);
    res.setHeader(header.CONTENT_TYPE, contentHeader);

    const result = getDataBaseOnHeader(clientAccept, statistics);
    res.send(result);
});
