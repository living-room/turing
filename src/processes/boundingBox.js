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

  const printOutOfBounds = function (changes) {
    for (assertion of changes.assertions) {
      if (
        assertion.x.value <= box[0] ||
        assertion.y.value <= box[1] ||
        assertion.x.value >= box[2] ||
        assertion.y.value >= box[3]
      ) {
        const animalSpeed = room.select([
          `${assertion.name.word} has speed ($dx, $dy)`
        ])
        console.log(`animalSpeed=${animalSpeed}`)
        // room.retract(`${assertion.name.word} has speed (${dx.value}, ${dy.value})`)
      }
    }
  }

  // query the db for all animals (any name, any type, any position)
  // and store them in the the provide `$`-variables
  const animals = room.subscribe(
    `$name is a $type animal at ($x, $y)`,
    printOutOfBounds
  )
}
