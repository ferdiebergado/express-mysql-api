import app from './app'

const PORT = app.get('port')
const server = app.listen(PORT)

server.on('listening', () => console.log('Server listening on port %s...', PORT))
