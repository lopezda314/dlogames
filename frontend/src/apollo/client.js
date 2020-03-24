import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

export const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4444"
      : "https://dlogames-yoga-prod.herokuapp.com/",
  fetch,
})
