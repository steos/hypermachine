import http from 'http'
import webmachine from './webmachine'

const webmachineServer = (dispatch, {port = 8080} = {}) => {

    const webm = webmachine()

    const server = http.createServer()

    server.on('request', (req, res) => {
        // let body = null

        console.log('received request', req.method, req.url, req.headers)

        const resource = dispatch(req.url)
        const request = {method: req.method, headers: req.headers}
        const {status, headers, body} = webm(resource, request)

        console.log('processed request:', status, headers, body)

        res.writeHead(status, headers)
        if (body != null) res.write(body)
        res.end()

        // req.on('data', chunk => body = body == null ? chunk.toString() : body + chunk)
        // req.on('end', () => {
            // if (body != null) console.log('have body:', body)
        //     res.end()
        // })
    })

    server.listen(port, () => console.log(`listening on port ${port}...`))
}

export default webmachineServer
