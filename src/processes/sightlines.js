export default Room => {
  const room = new Room()

  room.subscribe(
    '$a sees $b',
    '$a is a $ animal at ($ax, $ay) @ $',
    '$b is a $ animal at ($bx, $by) @ $',
    'sightlines is active',
    ({ assertions, retractions }) => {
      retractions.forEach(({ a, b, ax, ay, bx, by }) => {
        if (a === b) return
        room
          .retract(
            `table: draw a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
          )
      })

      assertions.forEach(({ a, b, ax, ay, bx, by }) => {
        if (a === b) return
        room
          .assert(
            `table: draw a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
          )
      })
    }
  )
  room.assert('sightlines is active')
}
