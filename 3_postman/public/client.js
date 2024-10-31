"use strict";

const contentType = {
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html",
};

const requestContainer = document.getElementById('resquestContainer');

const parametersContainer = document.getElementById('parametersContainer');
const headersContainer = document.getElementById('headersContainer');
const bodyContainer = document.getElementById('bodyContainer');
const methodInput = document.getElementById('method');
const urlInput = document.getElementById('url');
const bodyInput = document.getElementById('body');

const responseContainer = document.getElementById('responseContainer');

methodInput.addEventListener('input', showBodyInput);

fetchReq({ url: 'getRequests', method: 'GET', callback: createRequestButtons });

function createRequestButtons(data) {
    function parseRequestToFields (data) {
        parametersContainer.innerHTML = '';
        headersContainer.innerHTML = '';
    
        methodInput.value = data.method;
        urlInput.value = data.url;

        if (data.body) {
            console.log(data.body);
            bodyInput.value = data.body;
        }
    
        for (let key in data.parameters) {
            const parameter = document.createElement('div');
            parameter.innerHTML = `
                <input type="text" value="${key}" placeholder="ключ">
                <input type="text" value="${data.parameters[key]}" placeholder="значение">
                <button onclick="onRemoveParameterClick(this)">Удалить</button>
            `;
    
            parametersContainer.appendChild(parameter);
        }
    
        for (let key in data.headers) {
            const header = document.createElement('div');
            header.innerHTML = `
                <input type="text" value="${key}" placeholder="ключ">
                <input type="text" value="${data.headers[key]}" placeholder="значение">
                <button onclick="onRemoveHeaderClick(this)">Удалить</button>
            `;
    
            headersContainer.appendChild(header);
        }
    };

    requestContainer.innerHTML = '';
    
    for (let i = 0; i < data.length; i++) {
        let button = document.createElement('button');

        const method = data[i].method;

        const queryStr = data[i].parameters.length ? `?${Object.entries(data[i].parameters).map(([key, value]) => `${key}=${value}`).join('&')}` : '';
        const fullURL = `${data[i].url}${queryStr}`;

        button.innerText = `Метод: ${method}, URL: ${fullURL}`;

        button.onclick = async function() {
            parseRequestToFields(data[i]);
            showBodyInput();
        };
        
        requestContainer.appendChild(button);
    }
};

function createResponse(data) {
    responseContainer.innerHTML = '';

    if (typeof data.status === 'number') {
        const status = document.createElement('div');
        status.innerHTML = `Статус: ${data.status}`;
    
        responseContainer.appendChild(status);
    
        const headers = document.createElement('div');
        headers.innerHTML = '<div>Заголовки:</div>';
    
        for (let key in data.headers) {
            headers.innerHTML += `<div>${key}: ${data.headers[key]}</div>`;
        }
    
        responseContainer.appendChild(headers);
    
        const body = document.createElement('div');
        body.innerHTML = `Body: ${JSON.stringify(data.body)}`;
    
        responseContainer.appendChild(body);
    }
};

function onAddParameterClick() {
    const parameter = document.createElement('div');
    parameter.innerHTML = `
        <input type="text" placeholder="ключ">
        <input type="text" placeholder="значение">
        <button onclick="onRemoveParameterClick(this)">Удалить</button>
    `;

    parametersContainer.appendChild(parameter);
}

function onRemoveParameterClick(button) {
    button.parentElement.remove();
}

function onAddHeaderClick() {
    const header = document.createElement('div');
    header.innerHTML = `
        <input type="text" placeholder="ключ">
        <input type="text" placeholder="значение">
        <button onclick="onRemoveHeaderClick(this)">Удалить</button>
    `;

    headersContainer.appendChild(header);
}

function onRemoveHeaderClick(button) {
    button.parentElement.remove();
}

function getData() {
    const method = methodInput.value;
    const url = urlInput.value;
    const body = bodyInput.value;

    const parameters = Array.from(parametersContainer.children).reduce((prevValue, parameter) => {
        const [key, value] = parameter.children;

        return { ...prevValue, [key.value]: value.value };
    }, {});

    const headers = Array.from(headersContainer.children).reduce((prevValue, header) => {
        const [key, value] = header.children;

        return { ...prevValue, [key.value]: value.value };
    }, {});

    return { method, url, parameters, headers, body };
}

async function onSaveClick() {
    const data = getData();

    await fetchReq({
        url: 'saveRequest',
        method: 'POST',
        body: JSON.stringify(data),
    });

    fetchReq({ url: 'getRequests', method: 'GET', callback: createRequestButtons });
}

function onSendClick() {
    const data = getData();

    fetchReq({
        url: 'sendRequest',
        method: 'POST',
        body: JSON.stringify(data),
        callback: createResponse,
    });
}

function onRemoveClick() {
    parametersContainer.innerHTML = '';
    headersContainer.innerHTML = '';

    methodInput.value = '';
    urlInput.value = '';

    showBodyInput();
}

function showBodyInput() {
    const isShown = methodInput.value.toLowerCase() === 'post' ? 'block' : 'none';

    bodyContainer.style.display = isShown;
}

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
