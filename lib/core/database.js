const path = require('path')
const reql = require('rethinkdb')

class Database {
  constructor (that) {
    reql.connect({
      host: 'localhost',
      db: 'bot',
      user: 'admin',
      password: require(path.join(global.appRoot, '..', 'gasbot.json')).rethink
    }, (err, conn) => {
      if (err) { throw err }
      this.connection = conn
      that.emit('FUNC_dbReady')
    })
  }

  async setUserData (id, key, value) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('users').filter({ id: id }).run(this.connection)
        data = (await data.toArray())[0]

        if (!data) { data = {} }
        if (!data.id) { data.id = id }

        data[key] = value

        let dbres = await reql.table('users').insert(data, {conflict: 'replace'}).run(this.connection)

        resolve(dbres)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getUserData (id, key) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('users').filter({ id: id }).run(this.connection)
        data = await data.toArray()
        try {
          data = data[0][key]
        } catch (e) {
          data = undefined
        }
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  async setServerData (id, key, value) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('servers').filter({ id: id }).run(this.connection)
        data = (await data.toArray())[0]

        if (!data) { data = {} }
        if (!data.id) { data.id = id }

        data[key] = value

        let dbres = await reql.table('servers').insert(data, {conflict: 'replace'}).run(this.connection)

        resolve(dbres)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getServerData (id, key) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('servers').filter({ id: id }).run(this.connection)
        data = await data.toArray()
        try {
          data = data[0][key]
        } catch (e) {
          data = undefined
        }
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = Database
