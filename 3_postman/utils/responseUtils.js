const mapToObject = (map) => {
    const object = {};
    map.forEach((value, name) => {
        object[name] = value;
    });

    return object;
};

module.exports = { mapToObject };
