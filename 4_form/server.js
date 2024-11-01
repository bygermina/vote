const express = require('express');

const { form, validate } = require('./utils.js');

const webserver = express();

webserver.use(express.urlencoded({extended:true}));

const PORT = process.env.NODE_ENV === "development" ? 3050 : 7780;

webserver.listen(PORT, () => { 
    console.log("web server running on port " + PORT);
}); 

webserver.get('/form', (req, res) => {
    res.send(form());
});

webserver.post('/send', (req, res) => {
    const values = req.body;
    const errors = validate(values.name, values.age);

    if (!!Object.keys(errors).length) {
        res.send(form(errors, values));
    } else if (Object.keys(values).length === 2){
        res.redirect(`/result?name=${values.name}&age=${values.age}`);
    }
});

webserver.get('/result', (req, res) => {
    const values = req.query;

    res.send("name=" + values.name + " age=" + values.age);
});
