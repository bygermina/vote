const express = require('express');
const path = require('path');

const { form, validate } = require('./utils.js');

const webserver = express();

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/form', (req, res) => {
    res.send(form());
});

webserver.get('/send', (req, res) => {
    const values = req.query

    const errors = validate(values.name, values.age);

    if (!!Object.keys(errors).length) {
        res.send(form(errors, values));
    } else if (Object.keys(values).length === 2){
        res.send("name=" + values.name + " age=" + values.age);
    }
});
