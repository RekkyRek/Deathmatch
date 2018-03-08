const path = require('path')
const reql = require('rethinkdb')

class Database {
  constructor () {
    reql.connect({
      host: 'localhost',
      db: 'bot',
      user: 'admin',
      password: require(path.join(global.appRoot, '..', 'gasbot.json')).rethink
    }, (err, conn) => {
      if (err) { throw err }
      this.connection = conn
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

        await reql.table('users').insert(data).run(this.connection)

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getUserData (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('users').filter({ id: id }).run(this.connection)
        data = (await data.toArray())[0]

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

        await reql.table('servers').insert(data).run(this.connection)

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getServerData (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await reql.table('servers').filter({ id: id }).run(this.connection)
        data = (await data.toArray())[0]

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = Database
