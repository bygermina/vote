const variants = [
    { id: 1, name: "Red" },
    { id: 2, name: "Blue" },
    { id: 3, name: "Green" },
    { id: 4, name: "Yellow" },
];

const contentType = {
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html",
};

const header = {
    CONTENT_TYPE: "Content-Type",
    ACCEPT: "Accept",
};

module.exports = { variants, contentType, header };
