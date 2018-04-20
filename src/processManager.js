/**
 * This process manager is a nice way to add more animal processes to all work together
 * It would be cool if the processes themselves would check if they are active, etc
 */

const processManager = () => {
  const fps = 1
  const ms = 1000. / fps

  const Room = require('@living-room/client-js')
  room = new Room()

  const processNames = ['animalIlluminator', 'move', 'fear', 'sight', 'sightlines' ]

  const processes = processNames.map(name => require(`./processes/${name}.js`)(room))

  setInterval(() => {
    processes.forEach(process => {
       if (typeof process === 'function') {
         process()
       }
    })
  }, ms)
}

const processManagerLaunchpad = () => {
  try {
    processManager()
  } catch (e) {
    setTimeout(processManagerLaunchpad, 1000)
  }
}

setTimeout(processManagerLaunchpad, 3000)
