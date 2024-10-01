const express = require('express');
const path = require('path');

const { form, validate } = require('./utils.js');

const webserver = express();

webserver.use(express.json()); 

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;
const IP = process.env.NODE_ENV === "development" ? "http://localhost" : "http://178.172.195.18";
const ORIGIN = `${IP}:${PORT}`;

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/form', (req, res) => {
    res.send(form(`${ORIGIN}/send`));
});

webserver.get('/send', (req, res) => {
    const values = req.query

    const errors = validate(values.name, values.age);

    if (!!Object.keys(errors).length) {
        res.send(form(`${ORIGIN}/send`, errors, values));
    } else if (Object.keys(values).length === 2){
        res.send("name=" + values.name + " age=" + values.age);
    }
});
