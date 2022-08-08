/**
 * Creates a new client to a roomdb instance
 * This client will try and communicate over socket.io or http
 *
 * @param {host} host of living room server (defaults to http://localhost:3000)
 */

import { io } from 'socket.io-client'

export default class Room {
  constructor (host) {
    this._subscribeTimeout = 2500 // ms
    this._messages = []
    this._host = host || process.env.LIVING_ROOM_HOST || 'localhost:3000'
    if (!this._host.startsWith('http://')) this._host = `http://${this._host}`
    this._hosts = new Set([this._host])

    this._socket = io(this._host)
    this._socket.on('error', (error) => console.error(error))
    if (typeof window === 'object') {
      this._socket.on('reconnect', () => {
        window.location.reload(true)
      })
    }
  }

  /**
   * @param {String} ...facts
   * @param {Function} callback
   */
  unsubscribe (...facts) {
    const callback = facts.splice(facts.length - 1)[0]
    const patternsString = JSON.stringify(facts)

    const unwrapped = results => {
      const unwrappedResults = this._unwrap(results)
      callback(unwrappedResults)
    }
    this._socket.off(patternsString, unwrapped)

    return new Promise(resolve => {
      this._socket.emit('unsubscribe', patternsString, resolve)
    })
  }

  /**
   * Subscribe lets a callback listen to all assertions and retractions
   * Compare to .on() which fires off only for assertions
   *
   * @param {String} ...facts
   * @param {Function} callback
   */
  subscribe (...facts) {
    const callback = facts.splice(facts.length - 1)[0]

    return new Promise((resolve, reject) => {
      this._socket.on('error', reject)
      this._socket.on('subscribe', resolve)

      this._socket.on(facts, results => {
        // this.facts().then(f => console.log(f))
        // console.log({ results })
        const unwrappedResults = this._unwrap(results)
        callback(unwrappedResults)
      })
      this._socket.emit('subscribe', facts)
    })
  }

  _unwrap ({ assertions, retractions }) {
    const unwrap = fact => {
      const unwrapped = {}
      for (const key in fact) {
        const val = fact[key]
        if (typeof val === 'undefined') continue
        unwrapped[key] = val.value || val.word || val.text || val.id
      }
      return unwrapped
    }

    return {
      assertions: assertions.map(unwrap),
      retractions: retractions.map(unwrap)
    }
  }

  on (...facts) {
    const callback = facts.splice(facts.length - 1)[0]
    const cb = ({ assertions }) => assertions.forEach(callback)
    this.subscribe(...facts, cb)
  }

  off (...facts) {
    const callback = facts.splice(facts.length - 1)[0]
    const cb = ({ assertions }) => assertions.forEach(callback)
    this.unsubscribe(...facts, cb)
  }

  async send () {
    const messages = this._messages.splice(0, this._messages.length)

    return Promise.all(messages.map(verb => {
      if (verb.assert) return this._socket.emit('assert', verb.assert)
      if (verb.retract) return this._socket.emit('retract', verb.retract)
    }))
  }

  assert (...facts) {
    this._messages.push(...facts.map(assert => ({ assert })))
    return this
  }

  retract (...facts) {
    this._messages.push(...facts.map(retract => ({ retract })))
    return this
  }

  select (...facts) {
    return new Promise(resolve => {
      this._socket.emit('select', facts, resolve)
    })
  }

  async count (...facts) {
    return this.select(...facts).then(assertions => assertions.length)
  }

  async exists (...facts) {
    return this.count(...facts).then(count => count > 0)
  }
}
