// $name is a $species animal at ($x, $y)
// $species can see $distance

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const metadata = {
    url: `https://github.com/living-room/lovelace/blob/master/src/processes/sight.js`
  }

  room.subscribe(
    [
      `sight is active`,
      `$a is a $species animal at ($ax, $ay)`,
      `$b is a $ animal at ($bx, $by)`,
      `$species can see $distance`
    ],
    async ({ assertions, retractions }) => {
      // If sight is inactive, retract all sees facts
      if (retractions.includes('sight is active')) {
        const { assertions } = await room.select(`$aspecies sees $bspecies`)
        const retractions = assertions.map(({ aspecies, bspecies }) => {
          return `${aspecies.word} sees ${bspecies.word}`
        })
        return room.retract(retractions).then(console.dir)
      }

      assertions.forEach(async ({ a, b, ax, ay, bx, by, distance }) => {
        if (a.word === b.word) return
        const [dx, dy] = [
          100 * (ax.value - bx.value),
          100 * (ay.value - by.value)
        ]
        const seesFact = `${a.word} sees ${b.word}`

        if (dx * dx + dy * dy < distance * distance) {
          room.assert(seesFact).then(console.dir)
        } else {
          room.retract(seesFact).then(console.dir)
        }
      })
    }
  )

  room.assert('sight is active')
  for (let key in metadata) {
    room.assert(`sight has ${key} "${metadata[key]}"`)
  }
}
