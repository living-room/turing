export default Room => {
  const room = new Room()

  const em = 0.02
  let y = 1 - 2 * em
  const x = em
  // query animals
  room.subscribe(
    '$ $name is $how afraid of a $otherspecies',
    ({ assertions }) => {
      assertions.forEach(({ name, how, otherspecies }) => {
        const debug = `${name} ${how} afraid of ${otherspecies}`

        const fact = `whiteboard: draw small text "${debug}" at (${x}, ${y})`
        room.assert(fact).send()
        y -= em
      })
    }
  )
}
