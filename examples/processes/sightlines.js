module.exports = room => {
  if (!room) {
    const Room = require('../build/room.js')
    const room = new Room()
  }

  const lines = new Map()

  room.subscribe(
    [
      `$a sees $b`,
      `$a is a $aspecies animal at ($ax, $ay)`,
      `$b is a $bspecies animal at ($bx, $by)`
    ],
    async ({assertions, retractions}) => {
      assertions.forEach(async ({ a, b, ax, ay, bx, by }) => {
        const id = a.word + b.word
        const p = lines.get(id)
        if (!p || p.ax != ax || p.ay != ay || p.bx != bx || p.by != by) {
          lines.set(id, { ax, ay, bx, by })

          await room.assert(`${id}sightline is a (255, 127, 255) line from (${ax.value}, ${ay.value}) to (${bx.value}, ${by.value})`).then(console.dir)

          if (!p) return
          room.retract(`${id}sightline is a (255, 127, 255) line from (${p.ax.value}, ${p.ay.value}) to (${p.bx.value}, ${p.by.value})`).then(console.dir)

        }
      })
    }
  )
}
