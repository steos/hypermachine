import { StringDecoder } from 'string_decoder'

export type Body = string | AsyncIterable<any>

export type Headers = Record<string, string | string[] | undefined>

export interface Response {
  readonly body?: Body
  readonly status: number
  readonly headers: Headers
}

export interface Request {
  readonly headers: Headers
  readonly url: string
  readonly body: Body
  readonly method: string
}

export const readBody = async (body: Body, encoding: string = 'utf8'): Promise<string> => {
  if (typeof body === 'string') return body
  let str = ''
  const decoder = new StringDecoder(encoding)
  for await (let chunk of body) {
    if (typeof chunk === 'string') {
      str += chunk
    } else if (chunk instanceof Buffer) {
      str += decoder.write(chunk)
    }
  }
  str += decoder.end()
  return str
}
