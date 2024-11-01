const getHeadersObject = (headers) => {
    const headersObject = {};
    headers.forEach((value, name) => {
        headersObject[name] = value;
    });

    return headersObject;
};

module.exports = { getHeadersObject };
