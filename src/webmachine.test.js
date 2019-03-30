import test from 'ava'
import webmachine, {resource} from './webmachine'

const wm = webmachine()

const req = (method = 'GET', headers = {}, body = null) => ({method, headers, body})

const GET = (headers = {}) => req('GET', headers)

const POST = (body, headers = {}) => req('POST', headers, body)

const jsonPOST = (entity, headers = {}) => POST(JSON.stringify(entity), headers)

const validateJson = context => {
    if (context.request.body == null) return false
    try {
        context.entity = JSON.parse(context.request.body)
        return false
    } catch (e) {
        return true
    }
}

test('minimal resource', t => {
    const {status} = wm({}, GET())
    t.is(status, 200)
})

test('allowed methods', t => {
    const {status} = wm({
        'allowed-methods': ['POST']
    }, GET())
    t.is(status, 405)
})

test('malformed', t => {
    const resource = {
        'allowed-methods': ['GET', 'POST'],
        'malformed?': validateJson,
    }
    t.is(wm(resource, GET()).status, 200)
    t.is(wm(resource, POST('foo')).status, 400)
    t.is(wm(resource, jsonPOST({foo: 'bar'})).status, 201)
})

test('hello world', t => {
    const {status, body, headers} = wm({
        'available-media-types': ['text/plain'],
        'handle-ok': 'Hello World',
    }, GET())
    t.is(status, 200)
    t.is(body, 'Hello World')
    t.deepEqual(headers, {'Content-Type': 'text/plain'})
})

