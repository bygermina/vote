"use strict";

const contentType = {
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html",
};

const buttonContainer = document.getElementById('buttonContainer');
const statisticContainer = document.getElementById('statisticContainer');

let dataType = contentType.JSON;

async function getAndDrawStatistics() {
    return await fetchReq({
        url: 'stat',
        method: 'POST',
        headers: {
            'Content-Type': dataType,
            'Accept': dataType,
        },
        callback: drawStatistics,
    });
};

fetchReq({ url: 'variants', method: 'GET', callback: createButtons });
void getAndDrawStatistics();

async function onDataTypeButtonClick(contentType) {
    changeDataType(contentType);
    let data = await getAndDrawStatistics();

    if (contentType === "application/json") {
        console.log(data);
        data = JSON.stringify(data, null, 2);
    }

    download(data, contentType, `statistics.${contentType.split('/')[1]}`);
};

function createButtons(data) {
    for (let i = 0; i < data.length; i++) {
        let button = document.createElement('button');

        button.innerText = data[i].name;
        button.onclick = async function() {
            await fetchReq({ url: 'vote', method: 'POST', body: JSON.stringify({ variantId: data[i].id }) });
            await getAndDrawStatistics();
        };
        
        buttonContainer.appendChild(button);
    }
};

function changeDataType(type) {
    dataType = type;
};

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

async function fetchReq({
    url,
    method,
    headers = {
        'Content-Type': contentType.JSON,
        'Accept': contentType.JSON,
    },
    callback,
    body,
}) {
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
    
    try {
        const response = await fetch(`${window.origin}/${url}`, {
            method,
            headers,
            body,
        });

        if (callback) {
            const data = await convertResponse(headers["Content-Type"], response);

            callback?.(data);

            return data;
        }
    } catch (e) {
        console.log(e);
    }
};

function download(content, type, filename) {
    const blob = new Blob([content], { type });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    link.click();

    URL.revokeObjectURL(link.href);
};
