const ERROR = {
    REQUIRED: "Обязательное поле",
    LONG_LENGTH: "Обязательное поле",
    SHORT_LENGTH: "Имя слишком короткое",
    OUT_OF_RANGE: "Возраст вне диапазона",
};

const validate = (name, age) => {
    let errors = {};

    if (!name) {
        errors.name = ERROR.REQUIRED;
    } else if (name.length < 2) {
        errors.name = ERROR.SHORT_LENGTH;
    }

    if (!age) {
        errors.age = ERROR.REQUIRED;
    } else if (age < 0 || age > 100) {
        errors.age = ERROR.OUT_OF_RANGE;
    }

    return errors;
};

const form = (link, errors, values) =>
    `<form method=GET action="${link}" target=example>
        имя: <input type=text name=name value=${values?.name ?? ''}><br/>
        ${errors?.name ? `<p>${errors?.name}</p>` : ''}
        возраст: <input type=number name=age value=${values?.age ?? ''}><br/>
        ${errors?.age ? `<p>${errors?.age}</p>` : ''}
        <input type=submit value="Ok">
    </form>`;

module.exports = { validate, form };
