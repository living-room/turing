// This looks for animals, and adds text for them

module.exports = async room => {
  // query animals
  room.subscribe(
    `$name is a $ animal at ($x, $y)`,
    ({ assertions, retractions }) => {
      retractions.forEach(({ name, x, y }) => {
        const fact = `draw label ${name.word} at (${x.value}, ${y.value})`
        console.log(`retract: ${fact}`)
        room.retract(fact)
      })

      assertions.forEach(({ name, x, y }) => {
        const fact = `draw label ${name.word} at (${x.value}, ${y.value})`
        console.log(`${fact}`)
        room.assert(fact)
      })
    }
  )

  // set up some demo data
  room.select(`$name is a $ animal at ($, $)`).then(({ assertions }) => {
    const names = assertions.map(animal => animal.name.word)
    if (!names.includes('Simba')) {
      room.assert(`Simba is a cat animal at (0.5, 0.1)`)
    }
    if (!names.includes('Timon')) {
      room.assert(`Timon is a meerkat animal at (0.4, 0.6)`)
    }
    if (!names.includes('Pumba')) {
      room.assert(`Pumba is a warthog animal at (0.55, 0.6)`)
    }
  })
}
