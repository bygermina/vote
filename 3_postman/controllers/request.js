const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
        const { method, url, parameters, headers, body } = req.body;
        const fullUrl = getUrl(url, parameters);

        try {
            const response = await fetch(fullUrl, {
                method,
                headers,
                body,
            });

            res.send({
                status: response.status,
                headers: response.headers.raw(),
                body: response.body,
            });
        } catch (error) {   
            res.send({ status: 500, error });
        }
    }
}

module.exports = new RequestController();
