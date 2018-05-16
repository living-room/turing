module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.on(`$name is a $ animal at ($x, $y) @ $t`, ({ name, x, y }) => {
    room.retract(`table: draw label ${name} at ($, $)`)
    room.assert(`table: draw label ${name} at (${x}, ${y})`)
  })
}
