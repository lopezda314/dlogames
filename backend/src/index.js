require("dotenv").config({ path: "variables.env" })
const createServer = require("./createServer")
const db = require("./db")

const server = createServer()

server.start(
  {
    cors: {
      credentials: true,
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:8000"
          : process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`
    Server is now running on http://localhost:${deets.port}.
`)
  }
)
