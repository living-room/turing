// This listens for animals and gives them some attributes, like sight distance

// listens `$ is a $species animal at ($, $)`
// asserts `$species can see ${distance}`

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.subscribe(
    [`animalMaker is active`, `$ is a $species animal at ($, $)`],
    async ({ assertions }) => {
      for (const { species: { word: species } } of assertions) {
        if ((await room.select(`${species} can see $`)).length) return

        room.assert(`${species} can see ${Math.random() / 5}`)
      }
    }
  )

  room.subscribe(
    [`animalMaker is active`, `glow$id has hueIndex $hueIndex at ($x, $y)`],
    ({ assertions, retractions }) => {
      assertions.forEach(
        ({
          id: { value: id },
          x: { value: x },
          y: { value: y },
          hueIndex: { value: hueIndex }
        }) => {
          room.assert(`${id} is a glow animal at (${x}, ${y})`)
        }
      )
    }
  )

  room.assert('animalMaker is active')
}
