// Shows fear
module.exports = async room => {
  let em = 0.02
  let y = 1 - 2 * em
  let x = em
  // query animals
  room.subscribe(
    `fearIlluminator is active`,
    `$ $name is $how afraid of a $otherspecies`,
    ({ assertions }) => {
      assertions.forEach(({ name, how, otherspecies }) => {
        const debug = `${name.word} ${how.word} afraid of ${otherspecies.word}`

        const fact = `whiteboard: draw small text "${debug}" at (${x}, ${y})`
        room.assert(fact)
        y -= em
      })
    }
  )

  room.assert(`fearIlluminator is active`)
}
