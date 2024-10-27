const getUrl = (url, params) => {
    const queryString = new URLSearchParams(params).toString();

    return `${url}?${queryString}`;
};

module.exports = { getUrl };
