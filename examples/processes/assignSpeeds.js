const assignSpeeds = async room => {
  if (!room) {
    const Room = require('../build/room.js')
    room = new Room()
  }

  const animalsWithSpeed = await room.select([`$name is a $type animal at ($x, $y)`, `$name has speed ($dx, $dy)`])
  console.dir(animalsWithSpeed)

  animalsWithSpeed.solutions.forEach(({name, dx, dy}) => {
    room.retract(`${name.word} has speed (${dx.value}, ${dy.value})`)
  })

  const animals = await room.select(`$name is a $type animal at ($x, $y)`)

  animals.solutions.forEach(({name}) => {
      const dx = (Math.random() - 0.5) / 100
      const dy = (Math.random() - 0.5) / 100
      room.assert(`${name.word} has speed (${dx}, ${dy})`).then(console.dir)
  })
}

assignSpeeds()

module.exports = assignSpeeds
