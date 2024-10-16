const objToXml = (obj, rootTag = "root") => {
    function buildXml(obj, nodeName) {
        let xml = '';
        
        if (typeof obj === "object") {
            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    xml += `<${nodeName}>${buildXml(item, "item")}</${nodeName}>`;
                });
            }
            else {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const validKey = /^[0-9]/.test(key) ? `_${key}` : key;

                        xml += `<${validKey}>${buildXml(obj[key], validKey)}</${validKey}>`;
                    }
                }
            }
        }
        else {
            xml = obj.toString();
        }

        return xml;
    }

    return `<${rootTag}>${buildXml(obj, rootTag)}</${rootTag}>`;
};

const objToHtml = (obj) => {
    let htmlString = '';

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null) {
                htmlString +=
                    `<div><strong>${key}:</strong></div>
                    <div style="padding-left: 20px;">${buildHtml(value)}</div>`;
            } else {
                htmlString += `<div><strong>${key}:</strong> ${value}</div>`;
            }
        }
    }

    return htmlString;
}

module.exports = { objToXml, objToHtml };
