// 1. start the dev server using production config
process.env.NODE_ENV = 'testing'
// var server = require('../../build/dev-server.js')

const server = require('live-server')

var params = {
  // port: 8181, // Set the server port. Defaults to 8080.
  port: 8080, // Set the server port. Defaults to 8080.
  // host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  host: 'localhost', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: './', // Set root directory that's being served. Defaults to cwd.
  open: false, // When false, it won't load your browser by default.
  // open: true, // When false, it won't load your browser by default.
  // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
  file: 'index.html', // When set, serve this file for every 404 (useful for single-page applications)
  // wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
  mount: [['./js', './css']], // Mount a directory to a route.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  // middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
}
server.start(params)

let opts = process.argv.slice(2)
if (opts.indexOf('--config') === -1) {
  opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])
}
if (opts.indexOf('--env') === -1) {
  opts = opts.concat(['--env', 'chrome'])
}

const spawn = require('cross-spawn')
const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })

runner.on('exit', function (code) {
  server.shutdown()
  process.exit(code)
})

runner.on('error', function (err) {
  server.shutdown()
  throw err
})
