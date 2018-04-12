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
    async seers => {
      seers.forEach(async ({ a, b, ax, ay, bx, by }) => {
        const id = a.word + b.word
        const p = lines.get(id)
        if (!p || p.ax != ax || p.ay != ay || p.bx != bx || p.by != by) {
          lines.set(id, { ax, ay, bx, by })

          await room.assert(`${id}sightline is a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`)

          room.retract(`${id}sightline is a (255, 127, 255) line from (${p.ax}, ${p.ay}) to (${bx}, ${by})`)

        }
      })
    }
  )
}
