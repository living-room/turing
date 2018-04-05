'use strict'

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {host} host of living room server (defaults to http://localhost:3000)
 */
import fetch from 'node-fetch'
import io from 'socket.io-client'

function getEnv (key) {
  if (typeof process !== 'undefined') return process.env[key]
}

export default class Room {
  constructor (host) {
    this._host = host || getEnv('LIVING_ROOM_HOST') || 'http://localhost:3000'
    this._socket = io.connect(this._host)
  }

  /**
   * @param {String | String[]} facts
   * @param {Function} callback
   */
  subscribe (facts, callback) {
    if (typeof facts === 'string') facts = [facts]
    const patternsString = JSON.stringify(facts)
    this._socket.on(patternsString, callback)
    this._socket.emit('subscribe', patternsString)
  }

  /**
   *
   * @param {String} endpoint assert, retract, select
   * @param {[String]} facts
   */
  _request (endpoint, facts, callback) {
    if (!['assert', 'retract', 'select', 'facts'].includes(endpoint)) {
      throw new Error('Unknown endpoint, try assert, retract, select, or facts')
    }

    if (typeof facts === 'string') facts = [facts]

    if (!(endpoint === 'facts' || facts.length)) {
      throw new Error('Please pass at least one fact')
    }

    // Can this return a promise with the result?
    // Does that even make sense?
    if (this._socket.connected) {
      return new Promise((resolve, reject) => {
        this._socket.emit(endpoint, facts, resolve)
      })
    }

    const uri = `${this._host}/${endpoint}`

    const post = {
      method: 'POST',
      body: JSON.stringify({ facts }),
      headers: { 'Content-Type': 'application/json' }
    }

    return fetch(uri, post)
      .then(response => response.json())
      .catch(console.error)
  }

  assert (facts, callback) {
    return this._request('assert', facts, callback)
  }

  retract (facts, callback) {
    return this._request('retract', facts, callback)
  }

  select (facts, callback) {
    return this._request('select', facts, callback)
  }

  facts () {
    return this._request('facts')
  }
}
