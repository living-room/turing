// This is a demo of subscribing to a server query.
// It queries for animals in the database and draws them on screen.

const room = new window.room(`http://${window.location.hostname}:3000`)
const context = canvas.getContext('2d')

let animals = new Map()
let labels = new Map()
let circles = new Map()
let lines = new Map()

// Set up some demo data
room.select(`$name is a $type animal at ($x, $y)`).doAll(animals => {
  if (!animals) return
  const names = animals.map(animal => animal.name.word)
  if (names.indexOf('Simba') == -1) {
    room.assert(`Simba is a cat animal at (0.5, 0.1)`)
  }
  if (names.indexOf('Timon') == -1) {
    room.assert(`Timon is a meerkat animal at (0.4, 0.6)`)
  }
  if (names.indexOf('Pumba') == -1) {
    room.assert(`Pumba is a warthog animal at (0.55, 0.6)`)
  }
})

// Query animals
room.subscribe(
  `$name is a $animal animal at ($x, $y)`,
  ({ assertions, retractions }) => {
    retractions.forEach(({ name }) => animals.delete(name.word))

    assertions.forEach(animal => {
      animals.set(animal.name.word, {
        name: animal.name.word,
        x: animal.x.value,
        y: animal.y.value
      })
    })
  }
)

// Query labels
room.subscribe(
  `$name is a label at ($x, $y)`,
  ({ assertions, retractions }) => {
    retractions.forEach(({ name }) => labels.delete(name.word))

    assertions.forEach(label => {
      labels.set(label.name.word, {
        name: label.name.word,
        x: label.x.value,
        y: label.y.value
      })
    })
  }
)

// Query lines
room.subscribe(
  `$name is a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  ({ retractions, assertions }) => {
    retractions.forEach(({ name }) => {
      lines.delete(name.word)
    })

    assertions.forEach(line => {
      lines.set(line.name.word, {
        name: line.name.word,
        r: line.r.value,
        g: line.g.value,
        b: line.b.value,
        x: line.x.value,
        y: line.y.value,
        xx: line.xx.value,
        yy: line.yy.value
      })
    })
  }
)

// Query circles
room.subscribe(
  `$name is a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  ({ assertions, retractions }) => {
    retractions.forEach(({ name }) => circles.delete(name.word))

    assertions.forEach(circle => {
      circles.set(circle.name.word, {
        name: circle.name.word,
        x: circle.x.value,
        y: circle.y.value,
        r: circle.r.value,
        g: circle.g.value,
        b: circle.b.value,
        radius: circle.radius.value
      })
    })

    console.dir(assertions[assertions.length - 1])
  }
)

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = '40px sans-serif'

  animals.forEach(({ x, y }, name) => {
    previousFill = context.fillStyle
    context.fillStyle = '#ff00ff'
    context.fillText(name, x * canvas.width, y * canvas.height)
    context.fillStyle = previousFill
  })

  labels.forEach(({ x, y }, name) => {
    context.fillText(name, x * canvas.width, y * canvas.height)
  })

  circles.forEach(({ x, y, r, g, b, radius }, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.ellipse(
      x * canvas.width,
      y * canvas.height,
      radius,
      radius,
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  lines.forEach(({ x, y, xx, yy, r, g, b }, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.moveTo(x * canvas.width, y * canvas.height)
    context.lineTo(xx * canvas.width, yy * canvas.height)
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
