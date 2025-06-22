
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db/db.json')
  

const middlewares = jsonServer.defaults({ noCors: true })
server.use(middlewares)
server.use(router)

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
