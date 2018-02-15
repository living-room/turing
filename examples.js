// Serves up examples/ folder

const serve = require('serve')
const path = require('path')
const examples = path.resolve(__dirname, 'examples')
const server = serve(examples, { cors: true })
