const Room = require('../build/room.js')
const room = new Room() // grabs from process.env.LIVING_ROOM_URI

const moveRandomAnimal = () => {
  room.select([`$name is a $type animal at ($x, $y)`]).doAll(animals => {
    if (animals.length) {
      const { name, type, x, y } = animals[
        parseInt(Math.random() * animals.length)
      ]
      const [dx, dy] = [
        (Math.random() - 0.5) / 100,
        (Math.random() - 0.5) / 100
      ]

      room.assert(
        `${name.word} is a ${type.word} animal at (${x + dx}, ${y + dy})`
      )
      room.retract(`${name.word} is a ${type.word} animal at (${x}, ${y})`)

      console.log(`${type.word} ${name.word} moved by (${dx}, ${dy})`)
    }
  })
}

setInterval(moveRandomAnimal, 200)
