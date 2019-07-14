const fs = require('fs');
const path = require('path');

let dlonamesWords;
fs.readFile(path.resolve('../backend/static/base-words.txt'), 'utf8', (err, data) => {
    if (err) console.log(err);

    dlonamesWords = data.split('\n');
});
 

const getRandomTeam = () => {
    return Math.random() < .5 ? 'blue' : 'red';
}


const getDlonamesWords = () => {
    const usedNumbers = new Set();
    return Array(25).fill().map(() => {
        let index = Math.round(Math.random() * (dlonamesWords.length - 1));
        while (usedNumbers.has(index)) {
            index = Math.round(Math.random() * (dlonamesWords.length - 1));
        }
        usedNumbers.add(index);
        return dlonamesWords[index].toLowerCase();
    });
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
