const  { forwardTo } = require('prisma-binding')

const Query = {
    item: forwardTo('db'),
    items: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, context, info) {
        const userId = context.request.userId
        if (!userId) {
            return null
        }
        return context.db.query.user({
            where: { id: userId}
        }, info
        )
    },
};

module.exports = Query;
