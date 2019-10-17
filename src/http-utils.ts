// see https://tools.ietf.org/html/rfc2616#section-3.3

const wkday = '(Mon|Tue|Wed|Thu|Fri|Sat|Sun)'
const month = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
const time = '\\d{2}:\\d{2}:\\d{2}'

const rfc1123 = new RegExp(`^${wkday}, \\d{2} ${month} \\d{4} ${time} GMT$`)

export const parseDate = (s: string): Date | null => {
  if (rfc1123.test(s)) {
    return new Date(s)
  }
  return null
}

export const negotiateMediaType = (accept: string, available: string[]): string | null => {
  //TODO
  return null
}
