// Helper to create systemd services
const service = require('service-systemd')
const pkg = require('./package.json')
const path = require('path')

function add () {
  service.add({
    name: pkg.name,
    cwd: '.',
    app: path.resolve(`./examples.js`),
    user: 'room',
    engine: 'node',
    pid: `/var/run/${pkg.name}.pid`,
    log: `/var/log/${pkg.name}/log`,
    error: `/var/log/${pkg.name}/error`,
    'engine.bin': process.env.NODE,
    env: {
      NODE_ENV: 'production'
    }
  })
  .then(() => console.log(`${pkg.name} service removed`))
  .catch(err => console.error(`error removing ${pkg.name}`, err.toString()))
}

function remove () {
  service
    .remove(pkg.name)
    .then(() => console.log(`${pkg.name} service removed`))
    .catch(err => console.error(`error removing ${pkg.name}`, err.toString()))
}

switch (process.argv[2]) {
  case 'add': add(); break
  case 'remove': remove(); break
  default: remove(); add()
}
