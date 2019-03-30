import {head} from 'ramda'

const methodEquals = method => context =>
    context.request.method === method

const hasHeader = header => context =>
    context.request.headers[header] != null

const headerEquals = (header, value) => context =>
    context.request.headers[header] === value

const matchEtag = header => context =>
    context.etag === context.request.headers[header]

export default {
    'allowed-methods': ['GET', 'HEAD'],
    'available-media-types': ['application/json'],
    'available-languages': ['*'],
    'available-charsets': ['UTF-8'],
    'available-encodings': ['identity'],

    'new?': true,
    'service-available?': true,
    'authorized?': true,
    'allowed?': true,
    'valid-content-header?': true,
    'valid-entity-length?': true,
    'processable?': true,
    'exists?': true,
    'can-post-to-missing?': true,
    'can-put-to-missing?': true,
    'delete-enacted?': true,
    'known-content-type?': true,

    'is-options?': methodEquals('OPTIONS'),
    'method-put?': methodEquals('PUT'),
    'method-delete?': methodEquals('DELETE'),
    'method-patch?': methodEquals('PATCH'),

    'post-to-existing?': methodEquals('POST'),
    'put-to-existing?': methodEquals('PUT'),
    'post-to-gone?': methodEquals('POST'),

    'if-match-star-exists-for-missing?': headerEquals('if-match', '*'),
    'if-match-star?': headerEquals('if-match', '*'),
    'if-none-match-star?': headerEquals('if-none-match', '*'),

    'etag-matches-for-if-none?': matchEtag('if-none-match'),
    'etag-matches-for-if-match?': matchEtag('if-match'),

    'if-unmodified-since-exists?': hasHeader('if-unmodified-since'),
    'if-modified-since-exists?': hasHeader('if-modified-since'),
    'if-match-exists?': hasHeader('if-match'),
    'if-none-match-exists?': hasHeader('if-none-match'),

    'if-none-match?': context =>
        ['GET', 'HEAD'].includes(context.request.method),

    'if-unmodified-since-valid-date?': context => true, //TODO

    'modified-since?': context => {
        //TODO
        return false
    },

    'unmodified-since?': context => {
        //TODO
        return false
    },

    'known-method?': context => [
        'GET',
        'PUT',
        'POST',
        'DELETE',
        'HEAD',
        'OPTIONS',
        'TRACE',
        'PATCH'].includes(context.request.method),

    'method-allowed?': context => 
        context.resource['allowed-methods'].includes(context.request.method),

    'accept-exists?': context => {
        const {accept} = context.request.headers
        if (accept != null && accept !== '*/*') {
            return true
        }

        // TODO negotiate using "*/*" as accept header

        context.mediaType = head(context.resource['available-media-types'])
        return false
    },

    'media-type-available?': context => false //TODO
}
