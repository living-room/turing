// Draw animals on the table
module.exports = Room => {
  const room = new Room()

  const y = 0.1
  const x = 0.88
  const em = 0.05

  const getInitiative = async () => {
    return (await room.select(`$who rolled $what for initiative`))
      .sort((a, b) => b.what.value - a.what.value)
      .map(a => a.who.word)
  }

  room.on(`$who rolled $what for initiative`, async ({who, what}) => {
    const init = await getInitiative()
    let my = y
    room
      .retract(`draw label $ at (${x}, $)`)
      .assert(...init.map(who => `draw label ${who} at (${x}, ${my+=em})`))
  })

  room.on(`it is $name turn`, async ({ name }) => {
    const res = await room.select(`draw label ${name} at ($x, $y)`)
    if (!res.length) return
    const mx = res[0].x.value - em / 4
    const my = res[0].y.value

    room
      .retract(`draw small text ">" at ($, $)`)
      .assert(`draw small text ">" at (${mx}, ${my})`)
  })

  let maxFrame = 0

  room.on(`mouse clicked on frame $frame`, async ({ frame }) => {
    if (frame <= maxFrame) return
    maxFrame = frame
    const init = await getInitiative()
    const names = await room.select(`it is $name turn`)
    if (!names.length) return
    const name = names[0].name.word
    const num = init.indexOf(name) + 1
    const next = init[num % init.length]
    room
      .retract(`it is ${name} turn`)
      .assert(`it is ${next} turn`)
  })

  // bootstrap
  room.on(`initiativeTracker is $active`, ({ active }) => {
    room
      .assert(`gorog rolled 7 for initiative`)
      .assert(`shifty rolled 17 for initiative`)
      .assert(`stilgar rolled 8 for initiative`)
      .assert(`goblins rolled 10 for initiative`)
      .assert(`it is shifty turn`)
  })
}
