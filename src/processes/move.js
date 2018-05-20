module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')()
    room = new Room()
  }

  room.on(
    `$name is a $species animal at ($x, $y) @ $p`,
    `$name has speed ($dx, $dy)`,
    `time is $t`,
    ({ name, species, x, y, dx, dy, p, t }) => {
      if (t <= p) return
      room.retract(`${name} is a ${species} animal at (${x}, ${y}) @ ${p}`)
      room.assert(
        `${name} is a ${species} animal at (${x + dx}, ${y + dy}) @ ${t + 1}`
      )
    }
  )
}
