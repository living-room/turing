module.exports = room => {
  if (!room) {
    const Room = require('@living-room/client-js')
    room = new Room()
  }

  // const box = { x: 0, y: 0, w: 1, h: 1 }
  const box = { x: 0.25, y: 0.25, w: 0.5, h: 0.5 }

  // Redraw boundingBox if any attribute has changed
  const update_bounding_box = function (changes) {
    const x = box.x
    const y = box.y
    const w = box.w
    const h = box.h
    for (newBox of changes.assertions) {
      if (newBox.x != x || newBox.y != y || newBox.w != w || newBox.h != h) {
        draw_bounding_box(w, h, x, y)
        box = newBox
      }
    }
  }

  // If an animal intersects with a boundingBox wall "bounce" the animal in the
  // opposite direction
  const bounce_off_wall = function (changes) {
    const x = box.x
    const y = box.y
    const w = box.w
    const h = box.h
    for (animal of changes.assertions) {
      const dx = (animal.x <= x || animal.x >= w) ? -animal.dx : animal.dx
      const dy = (animal.y <= y || animal.y >= h) ? - animal.dy : animal.dy
      if (dx != animal.dx || dy != animal.dy) {
        room.retract(`${animal.name} has speed (${animal.dx}, ${animal.dy})`)
        room.assert(`${animal.name} has speed (${-animal.dx}, ${-animal.dy})`)
      }
    }
  }

  const draw_bounding_box = function (w, h, x, y) {
    room.assert([
      `draw a (255, 255, 255) line from (${x}, ${y}) to (${x+w}, ${y})`,
      `draw a (255, 255, 255) line from (${x+w}, ${y}) to (${x+w}, ${y+h})`,
      `draw a (255, 255, 255) line from (${x+w}, ${y+h}) to (${x}, ${y+h})`,
      `draw a (255, 255, 255) line from (${x}, ${y+h}) to (${x}, ${y})`
    ])
  }

  // Query the db for all animals (any name, any type, any position)
  //
  // Note: A feature of the subscribe function is that it uses a constraint
  // solver to satisfy the placeholders, e.g. $x and $y, before calling the
  // callback function.
  const animals = room.subscribe(
    `$name is a $type animal at ($x, $y) @ $frame`,
    `$name has speed ($dx, $dy)`,
    `boundingBox is active`,
    bounce_off_wall
  )

  // Query the db for all boundingBoxes (any position, any size)
  //
  // Note: A feature of the subscribe function is that it uses a constraint
  // solver to satisfy the placeholders, e.g. $x and $y, before calling the
  // callback function.
  const boxes = room.subscribe(
    `boundingBox is $w x $h at ($x, $y)`,
    update_bounding_box
  )

  draw_bounding_box(box.w, box.h, box.x, box.y)

  room.assert(`boundingBox is active`)
}
