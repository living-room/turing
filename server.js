import LivingRoomService from '@living-room/service-js'

import http from 'http'
import handler from 'serve-handler'
import proxy from 'http-proxy'
import udpforward from 'node-udp-forwarder'

import color from 'ansi-colors'
import boxen from 'boxen'
import open from 'open'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const service = new LivingRoomService()

service.listen({verbose: false}).then(({ port, oscport }) => {
  proxy.createProxyServer({target: `http://localhost:${port}`}).listen(3000)
  udpforward.create(oscport, 'localhost', { port: 4000 })

  const server = http.createServer((request, response) => {
    return handler(request, response, {
      cleanUrls: false,
      public: `${__dirname}/src`
    })
  })

  const staticport = 5000
  server.listen(staticport, () => {
    const uri = `http://localhost:${staticport}/displays/table.html`
    const formatting = {
      borderColor: `cyan`,
      padding: 1,
      dimBorder: true
    }
    const message = color.red(`displays and tools at\n${color.white(uri)}`)
    console.log(boxen(message, formatting))
    open(uri).catch()
  })
})
