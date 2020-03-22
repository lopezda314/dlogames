const Subscription = {
  game(parent, args, { pubsub }) {
    return pubsub.asyncIterator(args.id)
  },
}
module.exports = Subscription
