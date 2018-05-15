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
        const specieslist = await room.select(`${species} can see $`)
        if (specieslist && specieslist.length) return
        room.assert(`${species} can see ${Math.random() / 5}`)
      }
    }
  )

  room.assert('animalMaker is active')
}
