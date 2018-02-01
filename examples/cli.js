const Room = require('../build/room.js')
const room = new Room()

const facts = process.argv.slice(3)[0]

switch (process.argv[2]) {
  case 'assert':
    room.assert(facts)
    break;
  case 'retract':
    room.retract(facts)
    break;
  case 'select':
    room.select(facts)
        .do((response, index) => console.log(response))
    break;
}
