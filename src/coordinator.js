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

import boxen from 'boxen'
import color from 'ansi-colors'
import Room from '@living-room/client-js'
import path from 'path'
import fs from 'fs'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

setTimeout(() => {
  const processes = new Map()  

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
    color.red('  *') + ' has step function' +
    '\n\n' +
    processList.sort().join('\n')

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
    const processesFolder = path.join(__dirname, folder)
    
    fs.readdir(processesFolder, (_, processFiles) => {
      processFiles.forEach(async processFile => {
        try {
          const processFilePath = path.join(processesFolder, processFile)
          if (!fs.lstatSync(processFilePath).isFile) return
          
          import(processFilePath).then(process => {
            const stepping = process.default(Room)
            const step = stepping && stepping.step
            const delay = stepping && stepping.delay
            const name = processFile.replace(/.js$/, '')
            const active = false
            processes.set(name, {name, step, active, delay})
          })
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
