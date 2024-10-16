"use strict";

const contentType = {
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html",
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

let dataType = contentType.JSON;

const buttonContainer = document.getElementById('buttonContainer');
const statisticContainer = document.getElementById('statisticContainer');

const jsonButton = document.getElementById('Json');
const htmlButton = document.getElementById('HTML');
const xmlButton = document.getElementById('XML');

fetchReq({ url: 'variants', method: 'GET', callback: createButtons });
fetchReq({ url: 'stat', method: 'POST', headers: {
    'Content-Type': dataType,
    'Accept': dataType,
}, callback: drawStatistics });

jsonButton.addEventListener('click', () => changeDataType(contentType.JSON));
htmlButton.addEventListener('click', () => changeDataType(contentType.HTML));
xmlButton.addEventListener('click', () => changeDataType(contentType.XML));

function createButtons(data) {
    for (let i = 0; i < data.length; i++) {
        let button = document.createElement('button');

        button.innerText = data[i].name;
        button.onclick = async function() {
            await fetchReq({ url: 'vote', method: 'POST', body: JSON.stringify({ variantId: data[i].id }) });
            await fetchReq({
                url: 'stat',
                method: 'POST',
                headers: {
                    'Content-Type': dataType,
                    'Accept': dataType,
                },
                callback: drawStatistics });
        };
        
        buttonContainer.appendChild(button);
    }
}

function changeDataType(type) {
    dataType = type;
};

function parseXml(xmlData) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    return xmlDoc;
}

function drawStatistics(data) {
    statisticContainer.innerHTML = '';

    if (dataType === contentType.JSON) {
        for (let key in data) {
            let p = document.createElement('p');
            p.innerText = `${key}: ${data[key]}`;
            
            statisticContainer.appendChild(p);
        }
    }
    else if (dataType === contentType.XML) {
        statisticContainer.innerText = data;
    }
    else if (dataType === contentType.HTML) {
        statisticContainer.innerHTML += data;
    }; 
};

async function fetchReq ({
    url,
    method,
    headers = {
        'Content-Type': contentType.JSON,
        'Accept': contentType.JSON,
    },
    callback,
    body,
}) {
    try {
        const response = await fetch(`${window.origin}/${url}`, {
            method,
            headers,
            body,
        });

        if (callback) {
            const data = await convertResponse(headers["Content-Type"], response);

            callback?.(data);
        }
    
    } catch (e) {
        console.log(e);
    }
}
