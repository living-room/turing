// This looks for colors, and creates an animal for them
//  input: `$color $index is at ($x, $y)`
// output: `$name is a $ animal at ($x, $y)`,

// implementation left as an exercise for the reader

module.exports = async room => {
  // query animals
  room.subscribe(
    `$name is a $ animal at ($x, $y)`,
    ({ assertions, retractions }) => {
      retractions.forEach(({ name, x, y }) => {
        // let fact = `draw label ${name.word} at (${x.value}, ${y.value})`
        // console.log(`retract: ${fact}`)
        // room.retract(fact)
      })

      assertions.forEach(({ name, x, y }) => {
        // let fact = `draw label ${name.word} at (${x.value}, ${y.value})`
        // console.log(`${fact}`)
        // room.assert(fact)
      })
    }
  )
}
