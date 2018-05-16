// This is a demo of subscribing to a server query.

// Draw a word
//  `draw label $name at ($x, $y)`
//  `draw label Timon at (0.3, 0.3)`

// Draw a sentence
//  `draw text $text at ($x, $y)`
//  `draw text "timon is cool" at (0.8, 0.8)`

// Draw a tiny sentence
//  `draw small text $text at ($x, $y)`
//  `draw small text "timon is cool" at (0.8, 0.8)`

// Drawing a line
//  `draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`
//  `draw a (255, 255, 0) line from (0.3, 0.3) to (0.5, 0.5)`

// Drawing a circle:
//  `$name is a ($r, $g, $b) circle at ($x, $y) with radius $radius`
//  `draw a (255, 12, 123) circle at (0.5, 0.6) with radius 0.1`

// Drawing a halo:
//  `draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`
//  `draw a (255, 12, 123) halo around (0.5, 0.6) with radius 0.1`

const hostname = location.hostname
const pathArray = location.pathname.split('/')
const displayIndex = pathArray.indexOf('displays')
const namespace = pathArray[displayIndex + 1]

const room = new LivingRoom(`http://${hostname}:3000`)
const context = canvas.getContext('2d')

let labels = new Map()
let texts = new Map()
let circles = new Map()
let halos = new Map()
let lines = new Map()

const normToCoord = (n, s = canvas.height) => (n < -1 || n > 1 ? n : n * s)

const updateLabel = ({ assertions, retractions }) => {
  retractions.forEach(({ name }) => labels.delete(name.word))

  assertions.forEach(label => {
    labels.set(label.name.word, {
      name: label.name.word,
      x: label.x.value,
      y: label.y.value
    })
  })

  scheduleDraw()
}

const updateText = ({ assertions, retractions }) => {
  retractions.forEach(({ text }) => texts.delete(text.value))

  assertions.forEach(text => {
    console.dir(text)
    texts.set(text.text.value, {
      size: text.size && text.size.word,
      text: text.text.value,
      x: text.x.value,
      y: text.y.value
    })

    scheduleDraw()
  })
}

const updateLine = ({ retractions, assertions }) => {
  retractions.forEach(line => lines.delete(JSON.stringify(line)))

  assertions.forEach(line => {
    lines.set(JSON.stringify(line), {
      r: line.r.value,
      g: line.g.value,
      b: line.b.value,
      x: line.x.value,
      y: line.y.value,
      xx: line.xx.value,
      yy: line.yy.value
    })
  })

  scheduleDraw()
}

const updateCircle = ({ assertions, retractions }) => {
  retractions.forEach(circle => circles.delete(JSON.stringify(circle)))

  assertions.forEach(circle => {
    circles.set(JSON.stringify(circle), {
      x: circle.x.value,
      y: circle.y.value,
      r: circle.r.value,
      g: circle.g.value,
      b: circle.b.value,
      radius: circle.radius.value
    })
  })

  scheduleDraw()
}

const updateHalo = ({ assertions, retractions }) => {
  retractions.forEach(halo => halos.delete(JSON.stringify(halo)))

  assertions.forEach(halo => {
    halos.set(JSON.stringify(halo), {
      x: halo.x.value,
      y: halo.y.value,
      r: halo.r.value,
      g: halo.g.value,
      b: halo.b.value,
      radius: halo.radius.value
    })
  })

  scheduleDraw()
}

// text-box is a kind of element
// text-box elements have style "border: 2px solid; border-radius: 4px; font-size: 20px;"
// text-box elements have a "value" handled by javascript "this.textContent = value"
// text-box elements have a "size" handled by javascript "this.style.fontSize = size"
//
// kb-in-1 is a text-box element
// text-box element kb-in-1 has value "Hello, world!"

class MetaElement {
  constructor (containerEl) {
    this.instances = {};
    this.attributes = {};
    this.properties = {};
    this.el = containerEl;
  }

  setAttribute (name, value) {
    this.attributes[name] = value;
    for (let k in this.instances) {
      this.instances[k].setAttribute(name, value);
    }
  }

  removeAttribute (name) {
    delete this.attributes[name];
    for (let k in this.instances) {
      this.instances[k].removeAttribute(name);
    }
  }

  defineProperty (name, fn) {
    this.properties[name] = fn;
  }

  removeProperty (name) {
    delete this.properties[name];
  }

  createInstance(instanceName) {
    let el = this.instances[instanceName];
    if (el)
      return;
    el = document.createElement('div');
    for (let k in this.attributes) {
      el.setAttribute(k, this.attributes[k]);
    }
    this.instances[instanceName] = el;
    this.el.appendChild(el);
  }

  deleteInstance(instanceName) {
    let el = this.instances[instanceName];
    if (!el)
      return;
    delete this.instances[instanceName];
    this.el.removeChild(el);
  }

  updateProperty (instanceName, propertyName, value) {
    let instance = this.instances[instanceName];
    let propertyFn = this.properties[propertyName];
    if (!instance || !propertyFn)
      return;
    propertyFn.call(instance, value);
  }
}

class MetaMetaElement {
  constructor () {
    this.elementTypes = {};
    this.el = document.createElement('div');

    // TODO: Save facts about unknown or deleted types, and replay them if such
    // a type comes into existence.
    // this.elementFactsByType = {};

    let niceFact = fact => {
      console.log(fact);
      let nice = {};
      for (let k in fact) {
        let v = fact[k]
        nice[k] = v.word || v.value;
      }
      return nice;
    };

    let subscribe = (pattern, assert, retract) => {
      room.subscribe(pattern, ({ assertions, retractions }) => {
        for (let fact of assertions) {
          assert(niceFact(fact));
        }
        for (let fact of retractions) {
          retract(niceFact(fact));
        }
      });
    };

    subscribe(`$name is a kind of element`,
      newFact => {
        if (newFact.name in this.elementTypes)
          return;
        this.elementTypes[newFact.name] = new MetaElement(this.el);
      },
      retractedFact => {
        let type = this.elementTypes[retractedFact.name];
        if (!type)
          return;
        type.tearDown();
        delete this.elementTypes[retractedFact.name];
      }
    )
    subscribe(`$name elements have $attribute $value`,
      newFact => {
        let type = this.elementTypes[newFact.name];
        if (!type)
          return;
        type.setAttribute(newFact.attribute, newFact.value);
      },
      retractedFact => {
        let type = this.elementTypes[retractedFact.name];
        if (!type)
          return;
        type.removeAttribute(retractedFact.attribute);
      }
    )
    subscribe(`$name elements have a $property handled by javascript $code`,
      newFact => {
        let type = this.elementTypes[newFact.name];
        if (!type)
          return;
        type.defineProperty(newFact.property, new Function(newFact.property, newFact.code));
      },
      retractedFact => {
        let type = this.elementTypes[name];
        if (!type)
          return;
        type.removeProperty(newFact.property);
      }
    )
    subscribe(`$instanceName is a $name element`,
      newFact => {
        let type = this.elementTypes[newFact.name];
        if (!type)
          return;
        type.createInstance(newFact.name);
      },
      retractedFact => {
        let type = this.elementTypes[name];
        if (!type)
          return;
        type.deleteInstance(newFact.name);
      }
    )
    subscribe(`$name element $instanceName has $property $value`,
      newFact => {
        let type = this.elementTypes[newFact.name];
        if (!type)
          return;
        type.updateProperty(newFact.instanceName, newFact.property, newFact.value);
      },
      retractedFact => {
        let type = this.elementTypes[name];
        if (!type)
          return;
        type.updateProperty(newFact.instanceName, newFact.property, null);
      }
    )
  }
}

let metaMetaElement = new MetaMetaElement();
metaMetaElement.el.className = 'metaElements';
document.body.appendChild(metaMetaElement.el);

// Query labels
room.subscribe(`draw label $name at ($x, $y)`, updateLabel)
room.subscribe(`${namespace}: draw label $name at ($x, $y)`, updateLabel)

// Query text
room.subscribe(`draw text $text at ($x, $y)`, updateText)
room.subscribe(`${namespace}: draw text $text at ($x, $y)`, updateText)

// Query small text
room.subscribe(`draw $size text $text at ($x, $y)`, updateText)
room.subscribe(`${namespace}: draw $size text $text at ($x, $y)`, updateText)

// Query lines
room.subscribe(
  `draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) line from ($x, $y) to ($xx, $yy)`,
  updateLine
)
// Query circles
room.subscribe(
  `draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) circle at ($x, $y) with radius $radius`,
  updateCircle
)
// Query halos
room.subscribe(
  `draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`,
  updateHalo
)
room.subscribe(
  `${namespace}: draw a ($r, $g, $b) halo around ($x, $y) with radius $radius`,
  updateHalo
)

async function draw (time) {
  // if the window is resized, change the canvas to fill the window
  canvas.width = canvas.clientWidth * window.devicePixelRatio
  canvas.height = canvas.clientHeight * window.devicePixelRatio

  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#fff'
  context.font = `${40 * window.devicePixelRatio}px sans-serif`

  labels.forEach(({ x, y }, label) => {
    context.save()
    context.fillText(label, normToCoord(x, canvas.width), normToCoord(y))
    context.restore()
  })

  texts.forEach(({ x, y, size }, text) => {
    context.save()
    context.fillStyle = '#9999ff'
    if (size === 'small') {
      context.font = `${20 * window.devicePixelRatio}px sans-serif`
    }
    context.fillText(text, normToCoord(x, canvas.width), normToCoord(y))
    context.restore()
  })

  circles.forEach(({ x, y, r, g, b, radius }, name) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.ellipse(
      normToCoord(x, canvas.width),
      normToCoord(y),
      normToCoord(radius),
      normToCoord(radius),
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.restore()
  })

  halos.forEach(({ x, y, r, g, b, radius }, name) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.fillStyle = `rgb(${r},${g},${b},0)`
    context.beginPath()
    context.ellipse(
      normToCoord(x, canvas.width),
      normToCoord(y),
      normToCoord(radius),
      normToCoord(radius),
      0,
      0,
      2 * Math.PI
    )
    context.stroke()
    context.restore()
  })

  lines.forEach(({ x, y, xx, yy, r, g, b }, name) => {
    context.save()
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.beginPath()
    context.moveTo(x * canvas.width, y * canvas.height)
    context.lineTo(xx * canvas.width, yy * canvas.height)
    context.stroke()
    context.restore()
  })
}

let drawAnimationFrame = null
function scheduleDraw () {
  if (drawAnimationFrame) return
  drawAnimationFrame = requestAnimationFrame(() => {
    drawAnimationFrame = null
    draw()
  })
}

window.addEventListener('resize', draw)

draw()
