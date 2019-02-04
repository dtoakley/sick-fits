const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

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

        generateAndSetJwtToken(user.id, context)

        return user

    },

    async signin(parent, { email, password }, context, info) {

        const user = await context.db.query.user({ where: { email }})

        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            throw new Error('Invalid password!')
        }

        generateAndSetJwtToken(user.id, context)

        return user
    },

    signout(parent, args, context, info) {
        context.response.clearCookie('token')
        return { message: 'You are now signed out!' }
    },

    async requestPasswordReset(parent, { email }, context, info) {
        const user = await context.db.query.user({ where: { email }})

        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const randomBytesPromisified = promisify(randomBytes)
        const resetToken = (await randomBytesPromisified(20)).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000 //1 hour from now

        const res = await context.db.mutation.updateUser({
            where: {email},
            data: { resetToken, resetTokenExpiry }
        })

        return { message: 'Check your email for a link to reset your password.'}

    },

    async resetPassword(parent, args, context, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error('Your passwords don\'t match!')
        }

        const [user] = await context.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            }
        })
        console.log(user)
        console.log(args.resetToken)

        if (!user) {
            throw new Error('This token is either invalid or expired!')
        }

        const password = await bcrypt.hash(args.password, 10)
        const updatedUser = context.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        generateAndSetJwtToken(updatedUser.id, context)
        return updatedUser
    }
}

function generateAndSetJwtToken(userId, context) {

    const token = jwt.sign({ userId: userId}, process.env.APP_SECRET)
    context.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    })
}


module.exports = Mutations
