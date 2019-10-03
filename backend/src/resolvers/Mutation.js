const fs = require("fs")
const path = require("path")

const blueTeam = "blue"
const redTeam = "red"

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

const Mutation = {
  async createGame(parent, args, ctx, info) {
    const creatorName = args.creatorName.toLowerCase()
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
          currentTeam: getRandomTeam(),
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
          stage: "NOT_STARTED",
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
      info
    )
    const username = args.username.toLowerCase()
    if (
      new Set(existingGame.blueTeam).contains(username) ||
      new Set(existingGame.redTeam).contains(username)
    ) {
      return existingGame
    }
    if (!existingGame.blueCodemaster) {
      existingGame.blueTeam.push(args.username)
      return await ctx.db.mutation.updateDlonamesGame({
        where: { id: args.id },
        data: {
          blueCodemaster: username,
          blueTeam: existingGame.blueTeam,
        },
      })
    }
    if (!existingGame.redCodemaster) {
      existingGame.redTeam.push(username)
      return await ctx.db.mutation.updateDlonamesGame({
        where: { id: args.id },
        data: {
          redCodemaster: username,
          redTeam: existingGame.redTeam,
        },
      })
    }
    const teamToUpdate =
      existingGame.blueTeam.length >= existingGame.redTeam.length
        ? "redTeam"
        : "blueTeam"
    existingGame[teamToUpdate].push(username)
    const update = {}
    update.where = { id: args.id }
    update.data[teamToUpdate] = existingGame[teamToUpdate]
    return await ctx.db.mutation.updateDlonamesGame(update)
  },

  async submitClue(parent, args, ctx, info) {
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

  async guessWord(parent, args, ctx, info) {
    const existingGame = await ctx.db.query.dlonamesGame(
      {
        where: { id: args.id },
      },
      info
    )
    if (!existingGame.wordsGuessed) {
      existingGame.wordsGuessed = []
    }
    return await ctx.db.mutation.updateDlonamesGame(
      {
        where: { id: args.id },
        data: {
          wordsGuessed: {
            set: [...existingGame.wordsGuessed, args.word],
          },
        },
      },
      info
    )
  },
}

module.exports = Mutation
