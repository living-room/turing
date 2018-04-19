// $name is a $species animal at ($x, $y)
// $species can see $distance

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    const room = new Room()
  }

  // this only happens once on startup
  seed = async () => {
    // get all the species
    const species = new Set(
      await room
        .select(`$ is a $species animal at ($, $)`)
        .map(({ assertions }) => assertions)
        .map(({ species }) => species.word)
    )

    // get all the species with sight
    const sights = new Set(
      await room
        .select(`$species can see $`)
        .map(({ assertions }) => assertions)
        .map(({ species }) => species.word)
    )

    // if a specie does not have sight, give it sight
    for (specie of species) {
      if (!sights.has(specie)) {
        room.assert(`${species} can see _`, Math.floor(5 * Math.random()))
      }
    }
  }
  seed()

  room.subscribe(
    [
      `$a is a $aspecies animal at ($ax, $ay)`,
      `$b is a $bspecies animal at ($bx, $by)`,
      `$aspecies can see $distance`
    ],
    // why is this async?
    async ({ assertions, retractions }) => {
      assertions.forEach(async ({ a, b, ax, ay, bx, by, distance }) => {
        if (a.word === b.word) return
        const [dx, dy] = [
          100 * (ax.value - bx.value),
          100 * (ay.value - by.value)
        ]
        const seesFact = `${a.word} sees ${b.word}`

        if (dx * dx + dy * dy < $distance * $distance) {
          room.assert(seesFact).then(console.dir)
        } else {
          room.retract(seesFact).then(console.dir)
        }
      })
    }
  )
}
