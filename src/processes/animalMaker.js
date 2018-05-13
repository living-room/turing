// This looks for species and gives them sight

module.exports = async room => {
  const active = await room.select(`animalMaker is active`)

  room.subscribe(
    `$ is a $species animal at ($, $)`,
    ({ assertions }) => {
      assertions.forEach(async ({ species }) => {
        const species = species.value
        const {assertions} = await room.select(`${species} can see $`)
        if (assertions.length !== 0) return
        room.assert(`${species} can see ${Math.random()}`)
      })
    }
  )
}
