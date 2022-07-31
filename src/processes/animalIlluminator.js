// Draw animals on the table
export default Room => {
  const room = new Room()

  room.on(`$name is a $ animal at ($x, $y) @ $`, ({ name, x, y }) => {
    room
      .retract(`table: draw centered label ${name} at ($, $)`)
      .assert(`table: draw centered label ${name} at (${x}, ${y})`)
      .send()
  })
}
