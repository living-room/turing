const assignSpeeds = async room => {
  if (!room) {
    const Room = require('../build/room.js')
    room = new Room()
  }

  const animals = await room.select(`$name is a $type animal at ($x, $y)`)
  const animalsSpeeds = await room.select([`$name is a $type animal at ($x, $y)`, `$name has speed ($dx, $dy)`])
  const names = new Set(animalsSpeeds.solutions.map(({name}) => name.word))

  animalsSpeeds.forEach(({name, dx, dy}) => {
    room.retract(`${name.word} has speed (${dx.value}, ${dy.value})`)
  })

  names.forEach(name => {
      const dx = (Math.random() - 0.5) / 100
      const dy = (Math.random() - 0.5) / 100
      room.assert(`${name} has speed (${dx}, ${dy})`).then(console.dir)
  })
}

assignSpeeds()

module.exports = assignSpeeds
