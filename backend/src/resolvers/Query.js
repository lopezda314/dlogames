const Query = {
  async game(parent, args, ctx, info) {
    const game = await ctx.db.query.dlonamesGame(
      {
        where: { id: args.id },
      },
      info
    )
    if (!args.username) {
      return game
    }
    const username = args.username.toLowerCase()
    game.isUserJoined =
      new Set(game.blueTeam).has(username) ||
      new Set(game.redTeam).has(username)
    return game
  },

  async user(parent, args, ctx, info) {
    return await ctx.db.query.user(
      { where: { username: args.username } },
      `{ username dlonamesClueStats { id } }`
    )
  },

  async loginUser(parent, args, ctx, info) {
    const user = await ctx.db.query.user(
      { where: { username: args.username } },
      `{ username passcode }`
    )
    if (!user) return
    if (args.encryptedPasscode.toString() !== encryptedPasscode) return
    delete user.passcode
    return user
  },
}

module.exports = Query
