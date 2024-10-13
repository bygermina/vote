const { contentType } = require('../constants');
const { objToXml, objToHtml, objToString } = require('./convertData');

const getDataBaseOnHeader = (clientAccept, object) => {
    if (clientAccept === contentType.JSON) {
        return object;
    }
    else if (clientAccept === contentType.XML) {
        return objToXml(object);
    }
    else if (clientAccept === contentType.HTML) {
        return objToHtml(object);
    }
    else {
        return objToString(object);
    }
};

const getContentHeader = (clientAccept) => {
    const isValidClientHeader = Object.values(contentType).includes(clientAccept);
    const contentHeader = isValidClientHeader ? clientAccept : contentType.TEXT;

    return contentHeader;
};

module.exports = { getContentHeader, getDataBaseOnHeader };
