const Room = require('../build/room.js')
const room = new Room() // grabs from process.env.LIVING_ROOM_HOST

const waitAsecondBeforeCalling = fn => {
  setTimeout(fn, 1000)
}

const waitAsecond = async fn => {
  return new Promise((resolve, reject) => {
    setTimeout(fn, 1000)
  })
}

const moveIfHasSpeed = async () => {
  const animals = await room.select([
    `$name is a $type animal at ($x, $y)`,
    `$name has speed ($dx, $dy)`
  ])

  animals.forEach(async ({ name, type, x, y, dx, dy }) => {
    await room.assert(
      `${name.word} is a ${type.word} animal at (${x.value +
        dx.value}, ${y.value + dy.value})`
    )
    room.retract(
      `${name.word} is a ${type.word} animal at (${x.value}, ${y.value})`
    )
  })
}

setInterval(moveIfHasSpeed, 100)

const setSpeedForAnimalsWithoutSpeed = async () => {
  const animals = await room.select(`$name is a $type animal at ($x, $y)`)

  animals.forEach(async animal => {
    const speeds = await room.select(
      `${animal.name.word} has a speed of ($dx, $dy)`
    )
    if (!speeds.length) {
      let [dx, dy] = [Math.random() - 0.5, Math.random() - 0.5]
      const yo = await room.assert(`${name.word} has a speed of (${dx}, ${dy})`)
      console.dir(yo)
    }
  })
}

setSpeedForAnimalsWithoutSpeed()
