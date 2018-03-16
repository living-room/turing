/// A node.js commandline example

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

const LivingRoom = require('../build/room.js')
const room = new LivingRoom() // Defaults to http://localhost:3000

const facts = process.argv.slice(3)[0]

switch (process.argv[2]) {
  case 'assert':
    room.assert(facts)
    break
  case 'retract':
    room.retract(facts)
    break
  case 'select':
    room.select(facts)
        .do(console.log)
    break
  default:
    printHelp()
}
