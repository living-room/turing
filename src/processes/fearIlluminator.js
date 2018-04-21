// show fear

module.exports = async room => {
  let y = 0.05
  // query animals
  room.subscribe(
    `$ $name is $how afraid of a $otherspecies`,
    ({ assertions }) => {
      assertions.forEach(({ name, how, otherspecies }) => {
        const fact = `draw text "${name.word} ${how.word} afraid of ${
          otherspecies.word
        }" at (0.05, ${(y += 0.05)})`
        console.log(`${fact}`)
        room.assert(fact)
      })
    }
  )
}
