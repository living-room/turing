// This listens for animals and gives them some attributes, like sight distance

// listens `$ is a $species animal at ($, $)`
// asserts `$species can see ${distance}`

module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.subscribe([
    `animalMaker is active`,
    `$ is a $species animal at ($, $)`
  ], ({ assertions }) => {
    for (const { species } of assertions) {
      const species = species.value
      const { assertions } = await room.select(`${species} can see $`)
      if (assertions.length !== 0) return
      room.assert(`${species} can see ${Math.random()}`)
    }
  })

  room.assert('animalMaker is active')
}
