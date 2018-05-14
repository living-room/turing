// This looks for animals, and adds text for them
//    `$name is a $ animal at ($x, $y)`,

module.exports = async room => {
  room.subscribe(
    [
      `animalIlluminator is active`,
      `$ is a $species animal at ($x, $y)`,
      `$species can see $distance`
    ],
    ({ assertions, retractions }) => {
      const updateFact = ({ species, distance, x, y }, fn) => {
        const fact = `table: draw a (255, 255, 255) halo around (${x.value}, ${
          y.value
        }) with radius ${distance.value}`
        fn(fact)
      }

      retractions.forEach(retraction =>
        updateFact(retraction, room.retract.bind(room))
      )
      assertions.forEach(assertion =>
        updateFact(assertion, room.assert.bind(room))
      )
    }
  )

  room.subscribe(
    [`animalIlluminator is active`, `$name is a $ animal at ($x, $y)`],
    ({ assertions, retractions }) => {
      const updateFact = ({ name, x, y }, fn) => {
        const facts = [
          `table: draw label ${name.word} at (${x.value}, ${y.value})`
        ]
        facts.forEach(fact => {
          console.log(`${fn.name}: ${fact}`)
          fn(fact)
        })
      }

      retractions.forEach(retraction =>
        updateFact(retraction, room.retract.bind(room))
      )
      assertions.forEach(assertion =>
        updateFact(assertion, room.assert.bind(room))
      )
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

  room.assert(`animalIlluminator is active`)
}
