const Mutation = {
    async createGame(parent, args, ctx, info) {
        const game = await ctx.db.mutation.createDlonamesGame(
        {
            data: {
            ...args,
            },
        },
        info
        );    
        return game;
    },
};

module.exports = Mutation;
