"use strict";

const contentType = {
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html",
};

const parametersContainer = document.getElementById('parametersContainer');
const headersContainer = document.getElementById('headersContainer');

const methodInput = document.getElementById('method');
const urlInput = document.getElementById('url');

function onAddParameterClick() {
    const parameter = document.createElement('div');
    parameter.innerHTML = `
        <input type="text" placeholder="ключ">
        <input type="text" placeholder="значение">
        <button onclick="onRemoveParameterClick(this)">Remove</button>
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
        <button onclick="onRemoveHeaderClick(this)">Remove</button>
    `;

    headersContainer.appendChild(header);
}

function onRemoveHeaderClick(button) {
    button.parentElement.remove();
}

function getData() {
    const method = methodInput.value;
    const url = urlInput.value;

    const parameters = Array.from(parametersContainer.children).reduce((prevValue, parameter) => {
        const [key, value] = parameter.children;

        return { ...prevValue, [key.value]: value.value };
    }, {});

    const headers = Array.from(headersContainer.children).reduce((prevValue, header) => {
        const [key, value] = header.children;

        return { ...prevValue, [key.value]: value.value };
    }, {});

    return { method, url, parameters, headers };
}

async function onSaveClick() {
    const data = getData();

    await fetchReq({
        url: 'saveRequest',
        method: 'POST',
        headers: {
            'Content-Type': contentType.JSON,
            'Accept': contentType.JSON,
        },  
        body: JSON.stringify(data),
    });
}

function onSendClick() {
    const data = getData();

    fetchReq({
        url: 'sendRequest',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

function onRemoveClick() {
    parametersContainer.innerHTML = '';
    headersContainer.innerHTML = '';

    methodInput.value = '';
    urlInput.value = '';
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
