/**
 * Load each module inside the 'processes' folder, and
 * if they return a step function, run it at 1fps
 *
 * You can toggle the step function with
 *
 *    "$processName is active"
 *
 * Maybe we have the processManager emit 'tick'...
 */

const boxen = require('boxen')
const color = require('ansi-colors')

setTimeout(() => {
  const processes = new Map()

  const Room = require('@living-room/client-js')

  const updateProcesses = ({assertions, retractions}) => {
    assertions.forEach(({name}) => {
      if (!processes.has(name)) {
        processes.set(name, {name})
      }
      processes.get(name).active = true
      const {step, delay} = processes.get(name)
      if (step) {
        clearInterval(processes.get(name).interval)
        processes.get(name).interval = setInterval(step, delay || 1000)
      }
    })
    retractions.forEach(({name}) => {
      clearInterval(processes.get(name).interval)
    })

    const processList = Array.from(processes.values())
      .map(({name, active, interval}) => {
        return (typeof interval === 'object' ? color.red('* ') : '  ') +
          (active ? color.greenBright(name) : name)
      })

    const formatting = {
      padding: 1,
      borderStyle: 'round',
      dimBorder: true
    }

    const message = color.red('processes\n') +
    color.greenBright('  green') + ' is active\n' +
    color.red('  *') + ' has step fn' +
    '\n\n' +
    processList.join('\n')

    draw(boxen(message, formatting))
  }

  let drawTimeout = null

  const draw = text => {
    clearTimeout(drawTimeout)
    drawTimeout = setTimeout(() => {
      console.log(text)
    }, 2000)
  }

  const loadModulesInFolder = folder => {
    const path = require('path')
    const processesFolder = path.join(__dirname, folder)
    const fs = require('fs')
    fs.readdir(processesFolder, (_, processFiles) => {
      processFiles.forEach(processFile => {
        try {
          const processFilePath = path.join(processesFolder, processFile)
          if (!fs.lstatSync(processFilePath).isFile) return
          const stepping = require(processFilePath)(Room)
          const step = stepping && stepping.step
          const delay = stepping && stepping.delay
          const name = processFile.replace(/.js$/, '')
          const active = false
          processes.set(name, {name, step, active, delay})
        } catch (e) {
          console.error(e)
        }
      })
    })
  }

  const room = new Room()
  room.subscribe(`$name is active`, updateProcesses)
  loadModulesInFolder('processes')
}, 3000)
