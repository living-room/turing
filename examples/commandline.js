/// A node.js commandline example

const io = require('socket.io-client')
const socket = io.connect('http://localhost:3000')

const printHelp = () => {
  const invocation = process.argv.map(arg => {
    if (arg.endsWith('node')) return process.argv0
    if (arg.endsWith('.js')) {
      console.log(process.env.PWD)
      return arg.replace(`${process.env.PWD}/`, '')
    }
    if (arg === 'help') return ''
    return arg
  }).join(' ')

  console.error(`
  Assert, retract, or select facts from a living room server

  Assert a new fact

      ${invocation}assert "Gorog the barbarian is at (0.5, 0.7)"

  Select a fact

      ${invocation}select "$who the $what is at ($x, $y)"

  Retract a fact

      ${invocation}retract "Gorog the barbarian is at (0.5, 0.7)"
  `)
}

if (process.argv.length < 2) process.exit(printHelp())

const Room = require('../build/room.js')
const room = new Room() // Defaults to http://localhost:3000

const facts = process.argv.slice(3)[0]

switch (process.argv[2]) {
  case 'assert':
    room.assert(facts)
    //socket.emit('assert', [facts])
    break
  case 'retract':
    room.retract(facts)
    break
  case 'select':
    room.select(facts)
        .do(console.log)
    break
  case 'subscribe':
    room.subscribe(facts).on(console.log)
    process.stdin.on('data', () => process.exit())
    break
  default:
    printHelp()
}
