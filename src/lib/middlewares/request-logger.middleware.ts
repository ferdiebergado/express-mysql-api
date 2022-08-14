import { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestStart = Date.now()

  res.on('finish', () => {
    const { httpVersion, method, url, body } = req
    const contentLength = res.getHeader('content-length')
    // const { remoteAddress } = req.socket;

    const processingTime = Date.now() - requestStart

    const timestamp = new Date(requestStart).toISOString()

    console.log(
      `${timestamp} ${method} ${url} HTTP ${httpVersion} ${res.statusCode} ${res.statusMessage} ${contentLength} bytes ${processingTime} ms`
    )

    if (Object.keys(body).length > 0) console.log(body)
  })

  next()
}
