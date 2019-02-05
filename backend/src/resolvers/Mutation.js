const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const { transport, makeAnEmail } = require('../mail')
const { hasPermissions } = require('../utils')

const Mutations = {
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to create an item!')
        }

        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info)

        return item
    },

    updateItem(parent, args, ctx, info) {
        const updateData = { ...args }

        delete updateData.id

        return ctx.db.mutation.updateItem({
            data: updateData,
            where: {
                id: args.id
            }
        }, info)
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id }
        const item = await ctx.db.query.item({where}, `{ id title user { id }}`)

        const ownsItem = item.user.id === ctx.request.userId
        const hasDeletePermissions = ctx.request.user.permissions
            .some(permission => ['ADMIN', 'ITEM_DELETE']
            .includes(permission))

        if (!ownsItem && !hasDeletePermissions) {
            throw new Error('You don\'t have permissions!')
        }
        return ctx.db.mutation.deleteItem({where}, info)

    },


    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase()
        const password = await bcrypt.hash(args.password, 10)
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {
                    set: ['USER']
                }
            }
        }, info)

        generateAndSetJwtToken(user.id, ctx)

        return user

    },

    async signin(parent, { email, password }, ctx, info) {

        const user = await ctx.db.query.user({ where: { email }})

        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            throw new Error('Invalid password!')
        }

        generateAndSetJwtToken(user.id, ctx)

        return user
    },

    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token')
        return { message: 'You are now signed out!' }
    },

    async requestPasswordReset(parent, { email }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email }})

        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const randomBytesPromisified = promisify(randomBytes)
        const resetToken = (await randomBytesPromisified(20)).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000 //1 hour from now

        const res = await ctx.db.mutation.updateUser({
            where: {email},
            data: { resetToken, resetTokenExpiry }
        })

        const mailResponse = await transport.sendMail({
            from: 'd.lewistoakley@gmail.com',
            to: user.email,
            subject: 'Reset your password',
            html: makeAnEmail(`Your password reset link is: \n\n 
            <a href="${process.env.FRONTEND_URL}/password_reset?resetToken=${resetToken}">
            Click here to reset your password</a>`
            )
        })

        return { message: 'Check your email for a link to reset your password.'}

    },

    async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error('Your passwords don\'t match!')
        }

        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            }
        })

        if (!user) {
            throw new Error('This token is either invalid or expired!')
        }

        const password = await bcrypt.hash(args.password, 10)
        const updatedUser = ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        generateAndSetJwtToken(updatedUser.id, ctx)
        return updatedUser
    },

    async updateUserPermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!')
        }

        const currentUser = await ctx.db.query.user({ where: { id: ctx.request.userId }}, info)

        hasPermissions(currentUser, ['ADMIN', 'PERMISSION_UPDATE'])

        return ctx.db.mutation.updateUser({
            where: {
                id: args.userId
            },
            data: {
                permissions: {
                    set: args.permissions
                }
            }
        }, info)
    },

    async addToCart(parent, args, ctx, info) {
        const { userId } = ctx.request
        if (!userId) {
            throw new Error('You must be logged in!')
        }

        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        })

        if (existingCartItem) {
             return ctx.db.mutation.updateCartItem({
                 where: { id: existingCartItem.id},
                 data: { quantity: existingCartItem.quantity + 1 }
             }, info
             )
        }

        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info
        )
    },

    async removeFromCart(parent, args, ctx, info) {
        const cartItem = await ctx.db.query.cartItem({
            where: { id: args.id }
            }, `{ id, user { id } }`
        )
        if (!cartItem) throw new Error('No CartItem found!')

        if (cartItem.user.id !== ctx.request.userId) {
            throw new Error('Item is not in user\'s cart!')
        }

        return ctx.db.mutation.deleteCartItem({
            where: { id: args.id }
        }, info)
    }
}

function generateAndSetJwtToken(userId, ctx) {

    const token = jwt.sign({ userId: userId}, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    })
}


module.exports = Mutations
