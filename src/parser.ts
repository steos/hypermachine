type ParseResult<T> = [T, string]

export class Parser<T> {
  private f: (input: string) => ParseResult<T>[]
  constructor(f: (input: string) => ParseResult<T>[]) {
    this.f = f
  }
  parse(input: string) {
    return this.f(input)
  }
  chain<S>(f: (x: T) => Parser<S>) {
    return new Parser((input: string): ParseResult<S>[] =>
      this.parse(input).flatMap(([value, remaining]): ParseResult<S>[] => f(value).parse(remaining))
    )
  }
  concat(x: Parser<T>) {
    return new Parser(input => this.parse(input).concat(x.parse(input)))
  }
  map<S>(f: (x: T) => S) {
    return new Parser((input: string) =>
      this.parse(input).map(([value, remaining]) => [f(value), remaining])
    )
  }
  mapResult(f: (x: ParseResult<T>[]) => ParseResult<T>) {
    return new Parser<T>((input: string) => [f(this.parse(input))])
  }
  repeat() {
    return new Parser<T[]>(input => {
      let nextInput = input
      const xs: T[] = []
      let result = this.parse(nextInput)
      while (result.length > 0) {
        xs.push(result[0][0])
        nextInput = result[0][1]
        result = this.parse(nextInput)
      }
      return [[xs, nextInput]]
    })
  }
  optional(x: T) {
    return new Parser<T>(input => {
      const result = this.parse(input)
      return result.length > 0 ? result : [[x, input]]
    })
  }
}

export const pure = <T>(x: T) => new Parser((input: string) => [[x, input]])

export const zero = new Parser<any>(() => [])

export const item = new Parser(input => (input.length > 0 ? [[input[0], input.substring(1)]] : []))

export const char = (c: string) =>
  item.chain(char => new Parser(input => (char === c ? [[char, input]] : [])))

export const str = (s: string) =>
  new Parser(input => (input.startsWith(s) ? [[s, input.substring(s.length)]] : []))

export const regex = (re: RegExp) =>
  new Parser(input => {
    const match = input.match(re)
    if (match) {
      return [[match[0], input.substring(match[0].length)]]
    }
    return []
  })

export const choose = <T>(p: Parser<T>, q: Parser<T>) => p.concat(q).mapResult(xs => xs[0])

export const lexeme = <T>(p: Parser<T>) =>
  new Parser<T>(input => {
    const match = input.match(/^\s+/)
    return p.parse(match ? input.substring(match[0].length) : input)
  })
