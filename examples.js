// Serves up examples/ folder

const serve = require('serve')
const path = require('path')
const examples = path.resolve(process.cwd(), 'examples')
console.log(process.cwd())
console.log(examples)
const server = serve(examples, { cors: true })
