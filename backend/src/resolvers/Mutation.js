const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    },

    async deleteItem(parent, args, context, info) {
        const where = { id: args.id }
        const item = await context.db.query.item({where}, `{ id, title }`)
        return context.db.mutation.deleteItem({where}, info)
    },


    async signup(parent, args, context, info) {
        args.email = args.email.toLowerCase()
        const password = await bcrypt.hash(args.password, 10)
        const user = await context.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {
                    set: ['USER']
                }
            }
        }, info)

        generateAndSetJwtToken(user, context)

        return user

    },

    async signin(parent, { email, password }, context, info) {

        const user = await context.db.query.user({ where: { email }})

        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            throw new Error(`Invalid password`)
        }

        generateAndSetJwtToken(user, context)

        return user
    },

    signout(parent, args, context, info) {
        context.response.clearCookie('token')
        return {
            message: 'You have now signed out'
        }
    }
}

function generateAndSetJwtToken(user, context) {

    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET)
    context.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    })
}


module.exports = Mutations
