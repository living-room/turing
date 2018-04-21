module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const animalSpeeds = new Map()

  room.subscribe(
    `$name has speed ($dx, $dy)`,
    ({ assertions, retractions }) => {
      assertions.forEach(({ name, dx, dy }) => {
        animalSpeeds.set(name.word, {
          name: name.word,
          dx: dx.value,
          dy: dy.value
        })
      })

      // This is subtle and possibly painful
      // Only remove an animal if the retraction went through and its the current value
      // We must do this after setting new assertions, which feels unintuitive
      retractions.forEach(({ name, dx, dy }) => {
        const animalSpeed = animalSpeeds.get(name.word)
        if (
          animalSpeed &&
          animalSpeed.dx === dx.value &&
          animalSpeed.dy === dy.value
        ) {
          animalSpeeds.delete(name.word)
        }
      })
    }
  )

  room.assert('move is active')

  return () => {
    animalSpeeds.forEach(({ name, dx, dy }) => {
      room
        .select(`${name} is a $type animal at ($x, $y)`)
        .then(assertions => {
          assertions.forEach(({ type, x, y }) => {
            // does this trigger our subscription in a bad way?
            room.retract(
              `${name} is a ${type.word} animal at (${x.value}, ${y.value})`
            )
            // maybe this is why we need flushChanges / fluent programming
            room.assert(
              `${name} is a ${type.word} animal at (${x.value + dx}, ${y.value +
                dy})`
            )
          })
        })
    })
  }
}
