module.exports = async room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const animals = await room.select(`$name is a $type animal at ($x, $y)`)
  const animalsSpeeds = await room.select([
    `$name is a $type animal at ($x, $y)`,
    `$name has speed ($dx, $dy)`
  ])

  const names = new Set(animals.assertions.map(({ name }) => name.word))

  animalsSpeeds.assertions.forEach(({ name, dx, dy }) => {
    room.retract(`${name.word} has speed (${dx.value}, ${dy.value})`)
  })

  names.forEach(name => {
    const dx = (Math.random() - 0.5) / 100
    const dy = (Math.random() - 0.5) / 100
    room.assert(`${name} has speed (${dx}, ${dy})`).then(console.dir)
  })
}
