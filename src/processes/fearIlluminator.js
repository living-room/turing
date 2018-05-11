// Shows fear
module.exports = async room => {
  let y = 0.05
  let x = 0.05
  // query animals
  room.subscribe(
    `$ $name is $how afraid of a $otherspecies`,
    ({ assertions }) => {
      assertions.forEach(({ name, how, otherspecies }) => {
        const debug = `${name.word} ${how.word} afraid of ${otherspecies.word}`

        const fact = `whiteboard: draw text "${debug}" at (${x}, ${(y += 0.05)})`
        room.assert(fact)
      })
    }
  )
}
