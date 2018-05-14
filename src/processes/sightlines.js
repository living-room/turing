module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    const room = new Room()
  }

  room.subscribe(
    [
      `$a sees $b`,
      `$a is a $ animal at ($ax, $ay)`,
      `$b is a $ animal at ($bx, $by)`
    ],
    ({ assertions, retractions }) => {
      const updateLine = (
        {
          a: { word: a },
          b: { word: b },
          ax: { value: ax },
          ay: { value: ay },
          bx: { value: bx },
          by: { value: by }
        },
        fn
      ) => {
        fn(
          `table: draw a (255, 127, 255) line from ${ax}, ${ay}) to (${bx}, ${by})`
        )
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
