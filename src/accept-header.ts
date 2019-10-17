import * as P from './parser'

export interface MediaType {
  type: string
  subtype: string
}

export interface Parameter {
  name: string
  value: string
}

export type MediaRange = MediaType & {
  quality: number
  params: Parameter[]
}

const token = P.regex(/^[^\s;,/="]+/)

const qf = P.regex(/^\d(\.\d{1,3})/)

const str = P.regex(/^"[^"]+"/).map(s => s.substring(1, s.length - 1))

const mediaType = token.chain(type =>
  P.char('/').chain(() => token.chain(subtype => P.pure<MediaType>({ type, subtype })))
)

const quality = P.char('q').chain(() =>
  P.char('=').chain(() => qf.chain(q => P.pure(parseFloat(q))))
)

const param = token.chain(name =>
  P.char('=').chain(() => P.choose(token, str).chain(value => P.pure<Parameter>({ name, value })))
)

const mediaRange = P.lexeme(mediaType).chain(({ type, subtype }) =>
  P.lexeme(P.char(';'))
    .chain(() => P.lexeme(quality))
    .optional(1)
    .chain(q =>
      P.lexeme(P.char(';'))
        .chain(() => P.lexeme(param))
        .repeat()
        .chain(params => P.pure<MediaRange>({ type, subtype, quality: q, params }))
    )
)

const acceptHeader = mediaRange.chain(accept =>
  P.lexeme(P.char(','))
    .chain(() => mediaRange)
    .repeat()
    .chain(xs => P.pure([accept].concat(xs)))
)
export default acceptHeader
