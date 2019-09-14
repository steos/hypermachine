const requestHandler = (dispatch, webmachine) => (req, res) => {
  console.log('received request', req.method, req.url, req.headers)

  const resource = dispatch(req.url)

  if (resource == null) {
    console.log('no resource matched url')
    res.writeHead(404)
  } else {
    const request = { method: req.method, headers: req.headers }
    console.log('processing', request)
    console.log('with resource', resource)
    const { status, headers, body } = webmachine(resource, request)

    console.log('processed request:', status, headers, body)

    res.writeHead(status, headers)
    if (body != null) res.write(body)
  }
  res.end()
}

export default requestHandler
