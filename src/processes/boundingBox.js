module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const box = [0.25, 0.25, 0.5, 0.5]

  room.assert([
    `draw a (255, 255, 255) line from (${box[0]}, ${box[1]}) to (${box[0] + box[2]}, ${box[1]})`,
    `draw a (255, 255, 255) line from (${box[0] + box[2]}, ${box[1]}) to (${box[0] + box[2]}, ${box[1] + box[3]})`,
    `draw a (255, 255, 255) line from (${box[0] + box[2]}, ${box[1] + box[3]}) to (${box[0]}, ${box[1] + box[3]})`,
    `draw a (255, 255, 255) line from (${box[0]}, ${box[1] + box[3]}) to (${box[0]}, ${box[1]})`
  ])

  const printOutOfBounds = async function (changes) {
    for (animal of changes.assertions) {
      if (
        animal.x <= box[0] ||
        animal.y <= box[1] ||
        animal.x >= box[2] ||
        animal.y >= box[3]
      ) {
        room.retract(`${animal.name} has speed (${animal.dx}, ${animal.dy})`)
        room.assert(`${animal.name} has speed (${-animal.dx}, ${-animal.dy})`)
      }
    }
  }

  // Query the db for all animals (any name, any type, any position)
  // and store them in the the provide `$`-variables
  //
  // Note: A feature of the subscribe function is that it uses a constraint
  // solver to satisfy the placeholders, e.g. $x and $y, before calling the
  // callback function.
  const animals = room.subscribe(
    `$name is a $type animal at ($x, $y) @ $frame`,
    `$name has speed ($dx, $dy)`,
    printOutOfBounds
  )
}
