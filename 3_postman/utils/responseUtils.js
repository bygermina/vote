const { contentType } = require('../constants');
const { objToXml, objToHtml } = require('./convertData');

const getDataBaseOnHeader = (clientAccept, object) => {
    switch (clientAccept) {
        case contentType.JSON:
            return object;
        case contentType.XML:
            return objToXml(object);
        case contentType.HTML:
            return objToHtml(object);
        default:
            return object;
    }
};

const getContentHeader = (clientAccept) => {
    const isValidClientHeader = Object.values(contentType).includes(clientAccept);
    const contentHeader = isValidClientHeader ? clientAccept : contentType.TEXT;

    return contentHeader;
};

const convertResponse = async (type, response) => {
    switch(type) {
        case contentType.JSON:
            return await response.json();
        case contentType.HTML:
            return response.text();
        case contentType.XML:
            return response.text();
        default:
            return response;
    }
};

module.exports = { getContentHeader, getDataBaseOnHeader, convertResponse };
