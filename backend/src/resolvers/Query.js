const  { forwardTo } = require('prisma-binding')
const { hasPermissions } = require('../utils')

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
    async users(parent, args, context, info) {
        if (!context.request.userId) {
            throw new Error('You must be logged in to view users!')
        }
        hasPermissions(context.request.user, ['ADMIN', 'PERMISSION_UPDATE'])

        return context.db.query.users({}, info)
    },
};

module.exports = Query;
