module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    const room = new Room()
  }

  room.subscribe(
    `$a sees $b`,
    `$a is a $ animal at ($ax, $ay) @ $`,
    `$b is a $ animal at ($bx, $by) @ $`,
    `sightlines is active`,
    ({ assertions, retractions }) => {
      const updateLine = ({ a, b, ax, ay, bx, by }, fn) => {
        if (a === b) return
        const fact = `table: draw a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
        fn(fact).then(console.dir)
      }

      retractions.forEach(retraction =>
        updateLine(retraction, room.retract.bind(room))
      )
      assertions.forEach(assertion =>
        updateLine(assertion, room.assert.bind(room))
      )
    }
  )
}
