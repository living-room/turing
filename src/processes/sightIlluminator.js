export default Room => {
  const room = new Room()

  room.subscribe(
    '$name is a $species animal at ($x, $y) @ $t',
    '$species can see $distance',
    'sightIlluminator is active',
    ({ assertions, retractions }) => {
      retractions.forEach(({ name, x, y, distance }) => {
        room.retract(`table: draw a (255, 127, 127) halo around (${x}, ${y}) with radius ${distance}`)
      })
      assertions.forEach(({ name, x, y, distance }) => {
        room.assert(`table: draw a (255, 127, 127) halo around (${x}, ${y}) with radius ${distance}`)
      })
    }
  )
  room.assert('sightIlluminator is active')
}
