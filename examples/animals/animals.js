// This is a demo of subscribing to a server query.
// It queries for animals in the database and draws them on screen.

const room = new window.room(`http://${window.location.hostname}:3000`)
const context = canvas.getContext('2d')
let characters = new Map()
let circles = new Map()
let lines = new Map()
let animalFacts = []

// Set up some demo data
room.select(`$name is a $type animal at ($x, $y)`)
    .doAll(animals => {
      if (!animals) return
      const names = animals.map(animal => animal.name.word)
      if (names.indexOf('Simba')==-1)
        room.assert(`Simba is a cat animal at (0.5, 0.1)`)
      if (names.indexOf('Timon')==-1)
        room.assert(`Timon is a meerkat animal at (0.4, 0.6)`)
      if (names.indexOf('Pumba')==-1)
        room.assert(`Pumba is a warthog animal at (0.55, 0.6)`)
     })

// Query for locations of animals and update our local list
room
  .subscribe(`$name is a $animal animal at ($x, $y)`)
  .on(({assertions}) => {
    if (!assertions) return
    assertions.forEach(animal => {
      let [label, x, y] = [animal.name.word, animal.x.value, animal.y.value]
      characters.set(label, {x, y})
    })
  })

room
  .subscribe(`$name is a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`)
  .on(({assertions}) => {
    if (!assertions) return
    assertions.forEach(line => {
      console.dir(line)
      let [name, r, g, b, x, y, xx, yy] = [ line.name.word,
                                             line.r.value,
                                             line.g.value,
                                             line.b.value,
                                             line.x.value,
                                             line.y.value,
                                             line.xx.value,
                                             line.yy.value]
      lines.set(name, {name, r, g, b, x, y, xx, yy})
    })
  })

room
  .subscribe(`$name is a ($r, $g, $b) circle at ($x, $y) with radius $radius`)
  .on(({assertions}) => {
    if (!assertions) return
    assertions.forEach(circle => {
      let [name, x, y, r, g, b, radius] = [ circle.name.word,
                                             circle.x.value,
                                             circle.y.value,
                                             circle.r.value,
                                             circle.g.value,
                                             circle.b.value,
                                             circle.radius.value]
      circles.set(name, {name, x, y, r, g, b, radius})
    })
  })

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = '40px sans-serif'

  characters.forEach(({x, y}, name) => {
    context.fillText(name, x * canvas.width, y * canvas.height)
  })

  circles.forEach(({x, y, r, g, b, radius}, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle=`rgb(${r},${g},${b})`
    context.ellipse(x * canvas.width, y * canvas.height, radius, radius, 0, 0, 2 * Math.PI)
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  lines.forEach(({x, y, xx, yy, r, g, b}, name) => {
    const oldStrokeStyle = context.strokeStyle
    context.strokeStyle=`rgb(${r},${g},${b})`
    context.beginPath()
    context.moveTo(x * canvas.width, y * canvas.height)
    context.lineTo(xx * canvas.width, yy * canvas.height)
    context.stroke()
    context.strokeStyle = oldStrokeStyle
  })

  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
