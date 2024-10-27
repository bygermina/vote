const { webserver } = require("./server");
const { RequestsFile } = require('./utils/file');
const { getUrl } = require('./utils/string');

const requestsInstance = new RequestsFile();

webserver.get('/page', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "page.html"));
});

webserver.get('/requests', (_, res) => {
    const requests = requestsInstance.read();

    res.send(requests);
});

webserver.post('/saveRequest', (req, res) => {
    const requests = requestsInstance.read();
    requests.push(req.body);

    requestsInstance.write(requests);
    res.send({ success: true });
});

webserver.post('/sendRequest', async (req, res) => {
    const { method, url, parameters, headers } = req.body;
    const fullUrl = getUrl(url, parameters);

    const response = await fetch(fullUrl, {
        method,
        headers
    });

    res.send({
        status: response.status,
        body: response.body,
        headers: response.headers,
    });

    console.log(fullUrl, method, headers);
    console.log(response);
});
