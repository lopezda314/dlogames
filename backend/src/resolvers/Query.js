const Query = {
    games(parent, args, ctx, info) {
        return ctx.db.query.dlonamesGames(
          info
        );
    },
};

module.exports = Query;
