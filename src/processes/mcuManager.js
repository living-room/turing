// Cleans up after an MCU (which is a simple client constantly
// asserting its analog input value, without retractions).

module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  room.subscribe(
    `$name has analog value $value @ $seq`,
    ({ assertions, retractions }) => {
      const latestAssertions = new Map()

      for (let assertion of assertions) {
        const name = assertion.name.value
        const latestAssertion = latestAssertions.get(name) || assertion
        if (assertion.seq.value >= latestAssertion.seq.value) {
          latestAssertions.set(name, assertion)
        }
      }

      for (let [name, latestAssertion] of latestAssertions) {
        room.retract(`"${name}" has analog value $`)

        // room.retract(`table: draw text $ at (0.5, 0.5)`);
        // room.assert(`table: draw text "${name}: ${latestAssertion.value.value}" at (0.5, 0.5)`);

        room.assert(`"${name}" has analog value ${latestAssertion.value.value}`)
        room.retract(`"${name}" has analog value $ @ $`);
      }
    }
  )
}
