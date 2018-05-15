// This looks for animals, and adds text for them
//    `$name is a $ animal at ($x, $y)`,

module.exports = async room => {
  room.subscribe(
    [`hueIlluminator is active`, `glow$id has hueIndex $hueIndex at ($x, $y)`],
    ({ assertions, retractions }) => {
      const updateFact = (
        {
          id: { value: id },
          hueIndex: { value: hueIndex },
          x: { value: x },
          y: { value: y }
        },
        fn
      ) => {
        const fact = `table: draw a (0, 255, 255) halo around (${x}, ${y}) with radius 0.05`
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

  room.assert(`hueIlluminator is active`)
}
