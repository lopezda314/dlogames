const fs = require("fs")
const path = require("path")

const blueTeam = "blueTeam"
const redTeam = "redTeam"

const teamToCodemaster = {
  blueTeam: "blueCodemaster",
  redTeam: "redCodemaster",
}

let dlonamesWords
fs.readFile(
  path.resolve("../backend/static/base-words.txt"),
  "utf8",
  (err, data) => {
    if (err) console.log(err)

    dlonamesWords = data.split("\n")
  }
)

const getRandomTeam = () => {
  return Math.random() < 0.5 ? blueTeam : redTeam
}

const getDlonamesWords = () => {
  const usedNumbers = new Set()
  return Array(25)
    .fill()
    .map(() => {
      let index = Math.round(Math.random() * dlonamesWords.length)
      while (usedNumbers.has(index)) {
        index = Math.round(Math.random() * dlonamesWords.length)
      }
      usedNumbers.add(index)
      return dlonamesWords[index].toLowerCase()
    })
}

const getDlonamesIndices = () => {
  const usedNumbers = new Set()
  return Array(18)
    .fill()
    .map(() => {
      let index = Math.round(Math.random() * 24)
      while (usedNumbers.has(index)) {
        index = Math.round(Math.random() * 24)
      }
      usedNumbers.add(index)
      return index
    })
}

const getUpdateForWordGuessed = ({
  id,
  word,
  wordsGuessed,
  numGuesses,
  currentTeam,
  blueWords,
  redWords,
  deathWord,
  redClues,
  blueClues,
}) => {
  let newWordsGuessed = [...wordsGuessed, word]
  const update = {
    where: { id: id },
    data: {
      wordsGuessed: {
        set: newWordsGuessed,
      },
    },
  }
  let isCorrectGuess = false
  if (blueWords.includes(word) && currentTeam === "blueTeam") {
    isCorrectGuess = true
  }
  if (redWords.includes(word) && currentTeam === "redTeam") {
    isCorrectGuess = true
  }
  if (!isCorrectGuess || numGuesses === 0) {
    if (currentTeam === "redTeam") {
      redClues.push(word)
      update.data.redClues = { set: redClues }
    } else {
      blueClues.push(word)
      update.data.blueClues = { set: blueClues }
    }
    update.data.currentTeam = currentTeam === "redTeam" ? "blueTeam" : "redTeam"
    update.data.numGuesses = 0
    update.data.clue = ""
  } else {
    update.data.numGuesses = numGuesses - 1
  }
  const correctBlues = newWordsGuessed.filter(word => blueWords.includes(word))
  const correctReds = wordsGuessed.filter(word => redWords.includes(word))
  const isBlueWin = correctBlues.length === blueWords.length
  const isRedWin = correctReds.length === redWords.length
  if (isBlueWin) {
    update.data.winningTeam = "blueTeam"
    update.data.gameIsFinished = true
  }
  if (isRedWin) {
    update.data.winningTeam = "redTeam"
    update.data.gameIsFinished = true
  }
  if (word == deathWord) {
    update.data.winningTeam = currentTeam === "redTeam" ? "blueTeam" : "redTeam"
    update.data.gameIsFinished = true
  }
  return update
}

const maybeCreateUserDlonamesStats = async (username, database) => {
  const userStats = await database.query.userDlonamesStats({
    where: { username: username },
  })
  if (userStats) {
    return
  }
  await database.mutation.createUserDlonamesStats({
    data: {
      username: username,
    },
  })
}

const recordDlonamesClue = (
  gameId,
  codemaster,
  clue,
  numGuesses,
  redClues,
  blueClues,
  database
) => {
  const numCluesGiven = redClues.length + blueClues.length
  database.mutation.createDlonamesClue({
    data: {
      gameId,
      codemaster,
      numCluesGiven,
      clue,
      numGuesses,
    },
  })
}

const Mutation = {
  async createGame(parent, args, ctx, info) {
    const creatorName = args.creatorName.toLowerCase()
    maybeCreateUserDlonamesStats(creatorName, ctx.db)
    const indices = getDlonamesIndices()
    const firstTeam = getRandomTeam()
    const words = getDlonamesWords()
    const blueWords =
      firstTeam === blueTeam
        ? indices.slice(0, 9).map(index => words[index])
        : indices.slice(9, 17).map(index => words[index])
    const redWords =
      firstTeam === redTeam
        ? indices.slice(0, 9).map(index => words[index])
        : indices.slice(9, 17).map(index => words[index])
    const deathWord = words[indices[17]]
    return await ctx.db.mutation.createDlonamesGame(
      {
        data: {
          blueTeam: {
            set: [creatorName],
          },
          blueCodemaster: creatorName,
          redTeam: {
            set: [],
          },
          redCodemaster: "",
          currentTeam: firstTeam,
          blueClues: {
            set: [],
          },
          redClues: {
            set: [],
          },
          wordsGuessed: {
            set: [],
          },
          words: {
            set: words,
          },
          blueWords: {
            set: blueWords,
          },
          redWords: {
            set: redWords,
          },
          deathWord: deathWord,
          gameIsFinished: false,
        },
      },
      info
    )
  },

  async joinGame(parent, args, ctx, info) {
    const existingGame = await ctx.db.query.dlonamesGame(
      {
        where: { id: args.id },
      },
      `{ blueTeam redTeam blueCodemaster redCodemaster }`
    )
    const username = args.username.toLowerCase()
    maybeCreateUserDlonamesStats(username, ctx.db)
    if (
      new Set(existingGame.blueTeam).has(username) ||
      new Set(existingGame.redTeam).has(username)
    ) {
      return existingGame
    }
    if (!existingGame.blueCodemaster) {
      existingGame.blueTeam.push(args.username)
      return await ctx.db.mutation.updateDlonamesGame({
        where: { id: args.id },
        data: {
          blueCodemaster: username,
          blueTeam: {
            set: existingGame.blueTeam,
          },
        },
      })
    }
    if (!existingGame.redCodemaster) {
      existingGame.redTeam.push(username)
      return await ctx.db.mutation.updateDlonamesGame({
        where: { id: args.id },
        data: {
          redCodemaster: username,
          redTeam: {
            set: existingGame.redTeam,
          },
        },
      })
    }
    const teamToUpdate =
      existingGame.blueTeam.length >= existingGame.redTeam.length
        ? redTeam
        : blueTeam
    existingGame[teamToUpdate].push(username)
    const update = {}
    update.where = { id: args.id }
    update.data = {}
    update.data[teamToUpdate] = {
      set: existingGame[teamToUpdate],
    }
    return await ctx.db.mutation.updateDlonamesGame(update, info)
  },

  async submitClue(parent, args, ctx, info) {
    const existingGame = await ctx.db.query.dlonamesGame(
      { where: { id: args.id } },
      ` { id gameIsFinished currentTeam clue numGuesses wordsGuessed
        blueCodemaster redCodemaster blueClues redClues} `
    )
    if (existingGame.gameIsFinished) return existingGame
    if (existingGame.clue) return existingGame
    const username = args.username.toLowerCase()
    if (
      existingGame.currentTeam === "redTeam" &&
      existingGame.redCodemaster !== username
    ) {
      return existingGame
    }
    if (
      existingGame.currentTeam === "blueTeam" &&
      existingGame.blueCodemaster !== username
    ) {
      return existingGame
    }
    recordDlonamesClue(
      existingGame.id,
      existingGame.currentTeam === "redTeam"
        ? existingGame.redCodemaster
        : existingGame.blueCodemaster,
      existingGame.clue,
      existingGame.numGuesses,
      existingGame.redClues,
      existingGame.blueClues,
      ctx.db
    )
    return await ctx.db.mutation.updateDlonamesGame(
      {
        where: { id: args.id },
        data: {
          clue: args.clue,
          numGuesses: args.numGuesses,
        },
      },
      info
    )
  },

  async switchTeam(parent, args, ctx, info) {
    const newTeam = args.teamName
    const existingGame = await ctx.db.query.dlonamesGame(
      { where: { id: args.id } },
      ` { id blueTeam redTeam blueCodemaster redCodemaster } `
    )
    if (newTeam !== "redTeam" && newTeam !== "blueTeam") {
      return existingGame
    }
    const update = {}
    update.where = { id: args.id }
    update.data = {}

    const username = args.username.toLowerCase()
    const bluePlayers = new Set(existingGame.blueTeam)
    const redPlayers = new Set(existingGame.redTeam)

    const oldTeam = bluePlayers.has(username) ? blueTeam : redTeam
    const isTeamSwitch = oldTeam !== newTeam
    const userIsCodemaster =
      username === existingGame.redCodemaster ||
      username === existingGame.blueCodemaster

    if (args.isCodemaster) {
      if (existingGame[teamToCodemaster[newTeam]]) {
        // Don't let players override another codemaster.
        return existingGame
      }
      update.data[teamToCodemaster[newTeam]] = username
      if (userIsCodemaster) update.data[teamToCodemaster[oldTeam]] = ""
    } else {
      if (userIsCodemaster) {
        update.data[teamToCodemaster[oldTeam]] = ""
      }
    }
    if (isTeamSwitch) {
      oldTeam === blueTeam
        ? bluePlayers.delete(username) && redPlayers.add(username)
        : redPlayers.delete(username) && bluePlayers.add(username)
    }
    update.data[newTeam] = {
      set:
        newTeam === blueTeam ? Array.from(bluePlayers) : Array.from(redPlayers),
    }
    update.data[oldTeam] = {
      set:
        oldTeam === blueTeam ? Array.from(bluePlayers) : Array.from(redPlayers),
    }
    return await ctx.db.mutation.updateDlonamesGame(update, info)
  },

  async guessWord(parent, args, ctx, info) {
    const existingGame = await ctx.db.query.dlonamesGame(
      { where: { id: args.id } },
      ` { id gameIsFinished currentTeam clue numGuesses wordsGuessed
        blueTeam redTeam blueCodemaster redCodemaster blueWords
        redWords deathWord blueClues redClues } `
    )
    if (existingGame.gameIsFinished) return existingGame
    if (!existingGame.clue) return existingGame
    const username = args.username.toLowerCase()
    const bluePlayers = new Set(existingGame.blueTeam)
    const redPlayers = new Set(existingGame.redTeam)
    if (
      username === existingGame.blueCodemaster ||
      username === existingGame.redCodemaster
    ) {
      return existingGame
    }
    if (existingGame.currentTeam === "redTeam" && bluePlayers.has(username)) {
      return existingGame
    }
    if (existingGame.currentTeam === "blueTeam" && redPlayers.has(username)) {
      return existingGame
    }
    if (existingGame.wordsGuessed.includes(args.word)) {
      return existingGame
    }

    if (!existingGame.wordsGuessed) {
      existingGame.wordsGuessed = []
    }
    return await ctx.db.mutation.updateDlonamesGame(
      getUpdateForWordGuessed({
        id: args.id,
        word: args.word,
        wordsGuessed: existingGame.wordsGuessed,
        numGuesses: existingGame.numGuesses,
        currentTeam: existingGame.currentTeam,
        blueWords: existingGame.blueWords,
        redWords: existingGame.redWords,
        deathWord: existingGame.deathWord,
        blueClues: existingGame.blueClues,
        redClues: existingGame.redClues,
      }),
      info
    )
  },

  async changeTurn(parent, args, ctx, info) {
    const existingGame = await ctx.db.query.dlonamesGame(
      { where: { id: args.id } },
      ` { id clue gameIsFinished currentTeam blueCodemaster redCodemaster } `
    )
    if (existingGame.gameIsFinished) return existingGame
    if (!existingGame.clue) return existingGame
    if (
      args.username === existingGame.blueCodemaster ||
      args.username === existingGame.redCodemaster
    ) {
      return existingGame
    }
    const update = {
      where: { id: args.id },
      data: {
        currentTeam:
          existingGame.currentTeam === "redTeam" ? "blueTeam" : "redTeam",
        clue: "",
        numGuesses: 0,
      },
    }
    return await ctx.db.mutation.updateDlonamesGame(update, info)
  },
}

module.exports = Mutation
