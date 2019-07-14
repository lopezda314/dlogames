const getRandomTeam = () => {
    return Math.random() < .5 ? 'blue' : 'red';
}

const getDlonamesWords = () => {
    return [
        'cats',
        'dogs',
        'bananas',
        'apples',
        'oranges',
        'cats',
        'dogs',
        'bananas',
        'apples',
        'oranges',
        'cats',
        'dogs',
        'bananas',
        'apples',
        'oranges',
        'cats',
        'dogs',
        'bananas',
        'apples',
        'oranges',
        'cats',
        'dogs',
        'bananas',
        'apples',
        'oranges',
    ];
}

const Mutation = {
    async createGame(parent, args, ctx, info) {
        const game = await ctx.db.mutation.createDlonamesGame(
        {
            data: {
                blueTeam: {
                    set: [args.creatorName]
                },
                blueCodemaster: args.creatorName,
                redTeam: {
                    set: []
                },
                redCodemaster: '',
                currentTeam: getRandomTeam(),
                blueClues: {
                    set: []
                },
                redClues: {
                    set: []
                },
                wordsGuessed:{
                    set: []
                },
                words: {
                    set: getDlonamesWords()
                },
            },
        },
        info
        );    
        return game;
    },
};

module.exports = Mutation;
