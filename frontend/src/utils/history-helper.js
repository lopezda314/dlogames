// Returns the string ID of the dlonames game in the user's local storage.
// Returns empty string if there is no dlonames game.
export const getDlonamesHistory = () => {
  const dlogamesHistory = JSON.parse(localStorage.getItem("dlogamesHistory"))
  return dlogamesHistory && dlogamesHistory.dlonames
    ? dlogamesHistory.dlonames
    : ""
}

// Sets the string ID of the dlonames game in the user's local storage.
export const setDlonamesHistory = dlonamesId => {
  let dlogamesHistory = {}
  if (localStorage.getItem("dlogamesHistory")) {
    dlogamesHistory = JSON.parse(localStorage.getItem("dlogamesHistory"))
  }
  dlogamesHistory.dlonames = dlonamesId
  localStorage.setItem("dlogamesHistory", JSON.stringify(dlogamesHistory))
}

export const gameIdQuery = "gid"
