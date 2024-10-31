const { getUrl } = require('../utils/string');
const { File } = require('../utils/file');

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
    }
}

module.exports = new RequestController();
