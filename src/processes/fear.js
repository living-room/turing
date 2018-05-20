module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  const animalsWeHaveSeen = new Set()

  room.on(`$name is a $type animal at ($, $) @ $`, ({ type, name }) => {
    if (animalsWeHaveSeen.has(name)) return

    let fears = {
      [type]: 'not',
      mouse: 'mildly'
    }

    switch (type) {
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

    for (let otherType in fears) {
      let fearFact = `${type} ${name} is ${fears[otherType]} afraid of a ${otherType}`
      room.assert(fearFact)
    }
    animalsWeHaveSeen.add(name)
  })
}
