const { getUrl } = require('../utils/string');
const { File } = require('../utils/file');
const { getHeadersObject } = require('../utils/responseUtils');

class RequestController {
    constructor() {
        this.requestsInstance = new File(['../_requests.log']);
    }

    getRequests = (_, res) => {
        const requests = this.requestsInstance.read();
    
        res.send(requests);
    }

    saveRequest = (req, res) =>  {
        const requests = this.requestsInstance.read();
        requests.push(req.body);
    
        this.requestsInstance.write(requests);
        res.send({ success: true });
    }

    sendRequest = async (req, res) => {
        const { method, url, parameters, headers, body } = req.body;
        const fullUrl = getUrl(url, parameters);

        try {
            const response = await fetch(fullUrl, {
                method,
                headers,
                body,
            });

            const headersResponse = getHeadersObject(response.headers);

            res.send({
                status: response.status,
                headers: headersResponse,
                body: await response.text(),
            });
        } catch (error) {   
            res.send({ status: 500, error: error.toString() });
        }
    }
}

module.exports = new RequestController();
