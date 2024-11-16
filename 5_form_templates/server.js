const express = require('express');

const { validate, getFormView } = require('./utils.js');

const webserver = express();

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;

const formView = getFormView();

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/form', (req, res) => {
    res.send(formView({}));
});

webserver.get('/send', (req, res) => {
    const values = req.query;
    const errors = validate(values.name, values.age);

    if (!!Object.keys(errors).length) {
        res.send(formView({ errors, values }));
    } else {
        res.send("name=" + values.name + " age=" + values.age);
    }
});
