const moveIfHasSpeed = async room => {
  if (!room) {
    const Room = require('../build/room.js')
    room = new Room()
  }

  const animals = await room.select([
    `$name is a $type animal at ($x, $y)`,
    `$name has speed ($dx, $dy)`
  ])

  animals.solutions.forEach(({ name, type, x, y, dx, dy }) => {
    room.retract(
      `${name.word} is a ${type.word} animal at (${x.value}, ${y.value})`
    )
    room.assert(
      `${name.word} is a ${type.word} animal at (${x.value + dx.value}, ${y.value + dy.value})`
    )
  })
}

setInterval(moveIfHasSpeed, 100)
