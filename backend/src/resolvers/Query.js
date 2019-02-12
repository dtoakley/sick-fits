const  { forwardTo } = require('prisma-binding')
const { hasPermissions } = require('../utils')

const Query = {
    item: forwardTo('db'),
    items: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        const userId = ctx.request.userId
        if (!userId) {
            return null
        }
        return ctx.db.query.user({where: {id: userId}}, info)
    },
    async users(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to view users!')
        }
        hasPermissions(ctx.request.user, ['ADMIN', 'PERMISSION_UPDATE'])

        return ctx.db.query.users({}, info)
    },
    async order(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to view an order!')
        }
        console.log(args)
        const order = await ctx.db.query.order({where: {id: args.id}}, info)
        const ownsOrder = order.user.id === ctx.request.userId
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN')

        if (!ownsOrder && !hasPermissionToSeeOrder) {
            throw new Error('You don\'t have permission to view this order!')
        }
        return order
    },

    async orders(parent, args, ctx, info) {
        const { userId } = ctx.request
        if (!userId) {
            throw new Error('You must be signed in to view your orders!')
        }
        return ctx.db.query.orders({
                where: {
                    user: { id: userId },
                },
            },
            info
        )
    },
}

module.exports = Query
