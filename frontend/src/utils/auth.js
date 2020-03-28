import auth0 from "auth0-js"
import { navigate } from "gatsby"
import { getDlonamesHistory } from "./history-helper"

const isBrowser = typeof window !== "undefined"
const INITIAL_LOGIN_CALLBACK = () => "initial login"

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENTID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
      responseType: "token id_token",
      scope: "openid profile email",
    })
  : {}

const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
}

let user = {}

export const isAuthenticated = () => {
  if (!isBrowser) {
    return
  }

  return localStorage.getItem("currentUser") != null
}

export const login = () => {
  if (!isBrowser) {
    return
  }

  auth.authorize()
}

const setSession = (cb = () => {}) => (err, authResult) => {
  const dlonamesId = getDlonamesHistory()
  if (err) {
    if (err.code === "login_required") login()
    const errRedirectUri = dlonamesId ? "/dlonames/game?gid=" + dlonamesId : "/"
    navigate(errRedirectUri)
    cb()
    return
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    tokens.accessToken = authResult.accessToken
    tokens.idToken = authResult.idToken
    tokens.expiresAt = expiresAt
    user = authResult.idTokenPayload
    cb()
  }

  localStorage.setItem("currentUser", JSON.stringify(user))

  // Hacky hack that checks whether or not the callback passed in is our initial login cb
  // which is what we pass in when setting the user's session for initial login
  // whereas we pass in more meaningful functions for silent auth.
  if (cb === INITIAL_LOGIN_CALLBACK) {
    // Only force navigation for post auth0 portal logins.
    // Don't need to redirect on silent auth.
    const redirectUri = dlonamesId
      ? "/dlonames/game?gid=" + dlonamesId
      : "dlonames/game"
    if (dlonamesId) {
      const dlogamesHistory = JSON.parse(
        localStorage.getItem("dlogamesHistory")
      )
      delete dlogamesHistory.dlonames
      localStorage.setItem("dlogamesHistory", JSON.stringify(dlogamesHistory))
    }
    navigate(redirectUri)
  }
}

export const handleAuthentication = () => {
  if (!isBrowser) {
    return
  }

  auth.parseHash(setSession(INITIAL_LOGIN_CALLBACK))
}

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback()
  auth.checkSession({}, setSession(callback))
}

export const getProfile = () => {
  return JSON.parse(localStorage.getItem("currentUser"))
}

export const logout = () => {
  auth.logout()
}
