const express = require('express');
const path = require('path');

const webserver = express();

webserver.use(express.json()); 

const PORT = 7780;

const variants = [
    { id: 1, name: "Red" },
    { id: 2, name: "Blue" },
    { id: 3, name: "Green" },
    { id: 4, name: "Yellow" },
];

const statistics = variants.reduce((acc, variant) => {
    acc[variant.id] = 0;

    return acc;
}, {});

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/page', (req, res) => {
    res.sendFile(path.resolve(__dirname, "page.html"));
});

webserver.get('/variants', (req, res) => {
    res.send(variants);
});

webserver.post('/vote', (req, res) => {
    const variantId = req.body.variantId;

    if (variantId) {
        statistics[variantId] += 1;
        res.send({ success: true });
    }
});

webserver.post('/stat', (req, res) => {
    res.send(statistics);
});
