import server from './server'

const staticResources = {
    '/hello': {
        'handle-ok': 'Hello from Webmachine!',
        'available-media-types': ['text/plain']
    }
}

const dispatch = (url) => {
    const res = staticResources[url]
    return res || {'exists?': false, 'method-allowed?': true}
}

server(dispatch)

