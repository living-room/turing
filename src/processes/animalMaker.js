// This listens for animals and gives them some attributes,
// like how far they can see

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.on(
    `$ is a $species animal at ($, $) @ $`,
    `animalMaker is active`,
    async ({ species }) => {
      const specieslist = await room.select(`${species} can see $`)
      if (specieslist && specieslist.length) return
      room.assert(`${species} can see ${Math.random() / 5}`)
    }
  )

  // bootstrap
  setTimeout(() => {
    room.assert('animalMaker is active')
    room.assert(`simba is a cat animal at (0.4, 0.6) @ 1`)
    room.assert(`timon is a meerkat animal at (0.6, 0.6) @ 1`)
    room.assert(`pumba is a warthog animal at (0.5, 0.4) @ 1`)
  }, 100)
}
