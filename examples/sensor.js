
// comments for the formatter
// comments for the formatter
//
// comments for the formatter
// comments for the formatter
// comments for the formatter
// comments for the formatter

const Room = require('../build/room.js')
const room = new Room('http://crosby.cluster.recurse.com:3000')

setInterval(() => {
  room
    .select(`$name is a $type animal at ($x, $y)`)
    .doAll(animals => {
      const {name, type, x, y} = animals[parseInt(Math.random() * animals.length)]

      const [dx, dy] = [Math.random() / 100, Math.random() / 100]

      room.assert(`${name} is a ${type} animal at (${x + dx}, ${y + dy})`)
      room.retract(`${name} is a ${type} animal at (${x}, ${y})`)
    })
}, 2000)
