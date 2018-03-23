
const Room = require('../build/room.js')
const room = new Room()

room.select(`$name is a $type animal at ($x, $y)`)
  .doAll(animals => {
    animals.forEach(animal => {
      let {type, name} = animal
      let fears = {
        [type.word]: 'not',
        'mouse': 'mildly',
      }
      switch(type.word) {
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
        let fearFact = `${type.word} ${name.word} is ${fears[otherType]} afraid of a ${otherType}`
        room.assert(fearFact)
        console.log(fearFact)
      }
    })
  })
