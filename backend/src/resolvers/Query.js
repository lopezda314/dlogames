const Query = {
    game(parent, args, ctx, info) {
        return ctx.db.query.dlonamesGame(
          {
            where: { id: args.id },
          },
          info
        );
    },
};

module.exports = Query;
