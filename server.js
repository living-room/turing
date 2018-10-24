const service = require('@living-room/service-js')

const http = require('http')
const handler = require('serve-handler')
const proxy = require('http-proxy')
const udpforward = require('node-udp-forwarder')

const color = require('ansi-colors')
const boxen = require('boxen')
const opn = require('opn')

service.listen({ verbose: false }).then(({ port, oscport }) => {
  proxy.createProxyServer({target: `http://localhost:${port}`}).listen(3000)
  udpforward.create(oscport, 'localhost', { port: 4000 })

  const staticport = 5000

  const server = http.createServer((request, response) => {
    return handler(request, response, {
      cleanUrls: false,
      public: 'src'
    })
  })

  server.listen(staticport, () => {
    const uri = `http://localhost:${staticport}`
    const formatting = {
      borderColor: `cyan`,
      padding: 1,
      dimBorder: true
    }
    const message = color.red(`displays and tools at\n${color.white(uri)}`)
    console.log(boxen(message, formatting))
    opn(uri).catch(console.log)
  })
})
