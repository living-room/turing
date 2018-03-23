
const Room = require('../build/room.js')
const room = new Room() // grabs from process.env.LIVING_ROOM_URI

const sightLines = () => {
  room
    .select([`$a sees $b`,
            `$a is a $aspecies animal at ($ax, $ay)`,
            `$b is a $bspecies animal at ($bx, $by)`])
    .doAll(seers => {
      seers.forEach(({a, b, ax, ay, bx, by}) => {
        console.log(a, b, ax, ay, bx, by)
        const sightline = `${a.word}${b.word}line is a (255, 127, 255) line from (${ax}, ${ay}) to (${bx}, ${by})`
        setTimeout(() => room.retract(sightline), 100)
        room.assert(sightline)
      })
    })
}

setInterval(sightLines, 50)
