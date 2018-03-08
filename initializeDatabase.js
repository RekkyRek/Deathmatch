const r = require('rethinkdb')

r.connect({
  password: require('../gasbot.json').rethink
}, async (err, conn) => {
  if (err) throw err
  try { console.log('Dropping DB'); await r.dbDrop('bot').run(conn) } catch (e) { }
  console.log('Creating DB'); await r.dbCreate('bot').run(conn)

  try { console.log('Dropping servers'); await r.db('bot').tableDrop('servers').run(conn) } catch (e) { }
  console.log('Creating servers'); await r.db('bot').tableCreate('servers').run(conn)

  try { console.log('Dropping users'); await r.db('bot').tableDrop('users').run(conn) } catch (e) { }
  console.log('Creating users'); await r.db('bot').tableCreate('users').run(conn)
  process.exit()
})
