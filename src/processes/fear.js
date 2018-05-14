module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const animalsWeHaveSeen = new Set()

  room.subscribe(
    `fear is active`,
    `$name is a $type animal at ($, $)`,
    ({ assertions, retractions }) => {
      assertions.forEach(animal => {
        let { type, name } = animal
        if (animalsWeHaveSeen.has(name.word)) return
        let fears = {
          [type.word]: 'not',
          mouse: 'mildly'
        }
        switch (type.word) {
          case 'cat':
            fears['dog'] = 'very'
            fears['mouse'] = 'not'
            break
          case 'elephant':
            fears['mouse'] = 'very'
            break
          case 'dog':
            fears['cat'] = 'very'
            break
          case 'mouse':
            fears['cat'] = 'very'
            break
          default:
            break
        }

        for (var otherType in fears) {
          let fearFact = `${type.word} ${name.word} is ${
            fears[otherType]
          } afraid of a ${otherType}`
          room.assert(fearFact)
          console.log(fearFact)
        }
        animalsWeHaveSeen.add(name.word)
      })
    }
  )

  room.assert(`fear is active`)
}
