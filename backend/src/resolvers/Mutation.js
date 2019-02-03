const Mutations = {
    async createItem(parent, args, context, info) {
        //TODO - check if user is logged in

        const item = await context.db.mutation.createItem({
            data: {
                ...args
            }
        }, info)

        return item
    },

    updateItem(parent, args, context, info) {
        const updateData = { ...args }

        delete updateData.id

        return context.db.mutation.updateItem({
            data: updateData,
            where: {
                id: args.id
            }
        }, info)
    }
};

module.exports = Mutations;
