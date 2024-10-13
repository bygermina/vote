"use strict";

const buttonContainer = document.getElementById('buttonContainer');
const statisticContainer = document.getElementById('statisticContainer');

fetchReq({ url: 'variants', method: 'GET', callback: createButtons });
fetchReq({ url: 'stat', method: 'POST', callback: drawStatistics });

function createButtons(data) {
    for (let i = 0; i < data.length; i++) {
        let button = document.createElement('button');

        button.innerText = data[i].name;
        button.onclick = async function() {
            await fetchReq({ url: 'vote', method: 'POST', body: JSON.stringify({ variantId: data[i].id }) });
            await fetchReq({ url: 'stat', method: 'POST', callback: drawStatistics });
        };
        
        buttonContainer.appendChild(button);
    }
}

function drawStatistics(data) {
    statisticContainer.innerHTML = '';

    for (let key in data) {
        let p = document.createElement('p');
        p.innerText = `${key}: ${data[key]}`;
        
        statisticContainer.appendChild(p);
    }
};

async function fetchReq ({ url, method, callback, body }) {
    const response = await fetch(`${window.origin}/${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body,
    });

    if (callback) {
        const data = await response.json();
        callback?.(data);
    }
}
