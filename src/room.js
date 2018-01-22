'use strict'

/**
 * Creates a new http client to a roomdb instance
 *
 * @param {uri} location Location to connect (defaults to localhost:3000)
 */
import fetch from 'node-fetch'

export default class Room {
  constructor (uri) {
    this._uri = uri || `http://localhost:3000`
    this._id = null
  }

  _db (endpoint, data) {
    const body = Object.assign(data, {id: this._id})
    const post = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }

    return fetch(this._uri + '/' + endpoint, post)
      .then(response => response.json())
      .then(json => {
        this._id = json.id
        return json
      })
  }

  async facts () {
    return this._db('facts', {})
  }

  // todo: refactor to allow for easier callbacks
  async select (...facts) {
    return this._db('select', {facts})
  }

  // filler values not implemented
  async assert (fact, _) {
    return this._db('assert', {fact})
  }

  // filler values not implemented
  async retract (fact, _) {
    return this._db('retract', {fact})
  }
}
