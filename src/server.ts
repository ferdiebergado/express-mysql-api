import http from 'http'
import app from './app'

const PORT = app.get('port')
const server = http.createServer(app)

server.listen(PORT, () => console.log('Server listening on port %d...', PORT))
