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
  const processes = new Map()

  const Room = require('@living-room/client-js')
  const room = new Room()

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
        return (typeof interval === 'object' ? chalk.keyword('hotpink')('* ') : '  ')
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
          const stepping = require(processFilePath)(room)
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

  room.subscribe(`$name is active`, updateProcesses)
  loadModulesInFolder('processes')
}, 3000)
