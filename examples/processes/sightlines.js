const Room = require('../build/room.js')
const room = new Room() // grabs from process.env.LIVING_ROOM_URI

const lines = new Map()

room.subscribe(
  [
    `$a sees $b`,
    `$a is a $aspecies animal at ($ax, $ay)`,
    `$b is a $bspecies animal at ($bx, $by)`
  ],
  seers => {
    seers.forEach(({ a, b, ax, ay, bx, by }) => {
      const id = a.word + b.word
      const p = lines.get(id)
      if (!p || p.ax != ax || p.ay != ay || p.bx != bx || p.by != by) {
        lines.set(id, { ax, ay, bx, by })
        const sightline = `${id}line is a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
        console.log(sightline)
        setTimeout(() => {
          const previoussightline = `${id}line is a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
          room.retract(previoussightline)
        }, 100)

        room.assert(sightline)
      }
    })
  }
)
