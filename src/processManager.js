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
const chalk = require('chalk').default

setTimeout(() => {
  const fps = 1
  const ms = 1000.0 / fps
  const processes = new Map()

  const Room = require('@living-room/client-js')
  const room = new Room()

  const updateProcesses = ({assertions, retractions}) => {
    assertions.forEach(({name}) => {
      if (!processes.has(name.word)) {
        processes.set(name.word, {name: name.word})
      }
      processes.get(name.word).active = true
    })
    retractions.forEach(({name}) => {
      processes.get(name.word).active = false
    })

    const processList = Array.from(processes.values())
      .map(({name, active, step}) => {
        return (typeof step === 'function' ? chalk.keyword('hotpink')('* ') : '  ')
          + (active ? chalk.greenBright(name) : name)
      })

    const formatting = {
      padding: 1,
      borderStyle: 'round',
      float: 'center',
      dimBorder: true
    }

    const message = chalk.keyword('hotpink')('processes\n')
    + chalk.greenBright('  green') + ' is active\n'
    + chalk.keyword('hotpink')('  *') + ' has step fn'
    + '\n\n'
    + processList.join('\n')

    console.log(boxen(message, formatting))
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
          const step = require(processFilePath)(room)
          const name = processFile.replace(/.js$/, '')
          const active = false
          processes.set(name, {name, step, active})
        } catch (e) {
          console.error(e)
        }
      })
    })
  }

  const step = () => {
    for (let {name, active, step} of processes.values()) {
      if (active && typeof step === 'function') {
        step()
      }
    }
  }

  room.subscribe(`$name is active`, updateProcesses)
  loadModulesInFolder('processes')
  setInterval(step, ms)
}, 3000)
