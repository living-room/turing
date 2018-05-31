const service = require('@living-room/service-js')
const forward = require('http-port-forward')

const proxy = async () => {
  const { port, oscport } = await service.listen({ verbose: false })
  forward(port, 3000)
  forward(oscport, 5000)
}
proxy()
