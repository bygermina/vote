const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");

const ERROR = {
    REQUIRED: "Обязательное поле",
    LONG_LENGTH: "Имя слишком длинное",
    SHORT_LENGTH: "Имя слишком короткое",
    OUT_OF_RANGE: "Возраст вне диапазона",
};

const validate = (name, age) => {
    let errors = {};

    if (!name) {
        errors.name = ERROR.REQUIRED;
    } else if (name.length < 2) {
        errors.name = ERROR.SHORT_LENGTH;
    } else if (name.length > 30) {
        errors.name = ERROR.LONG_LENGTH;
    }

    if (!age) {
        errors.age = ERROR.REQUIRED;
    } else if (age < 0 || age > 100) {
        errors.age = ERROR.OUT_OF_RANGE;
    }

    return errors;
};

const getFormView = () => {
    const formViewString = fs.readFileSync(path.join(__dirname, 'views','form.handlebars'),"utf8"); //можно ли читать фа
    const formView = Handlebars.compile(formViewString);

    return formView;
};

module.exports = { validate, getFormView };
