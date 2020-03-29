const isBrowser = typeof window !== "undefined"

export const isAuthenticated = () => {
  if (!isBrowser) {
    return
  }

  return localStorage.getItem("currentUser") != null
}

export const getUser = () => {
  if (!isBrowser) {
    return ""
  }
  return localStorage.getItem("currentUser")
}
