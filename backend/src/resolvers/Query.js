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
}

module.exports = Query
