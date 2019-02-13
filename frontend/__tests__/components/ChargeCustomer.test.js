import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import NProgress from 'nprogress'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'

import ChargeCustomer from '../../components/ChargeCustomer'
import { CURRENT_USER_QUERY } from '../../components/User'
import { testUser, testCartItem } from '../../lib/testUtils'

Router.router = { push() {} }

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...testUser(),
                    cart: [testCartItem()],
                },
            },
        },
    },
]

describe('<TakeMyMoney/>', () => {
    it('renders and matches snapshot', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ChargeCustomer />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const checkoutButton = wrapper.find('ReactStripeCheckout')
        expect(toJSON(checkoutButton)).toMatchSnapshot()
    })
    it('creates an order onToken', async () => {
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz789' } },
        })
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ChargeCustomer />
            </MockedProvider>
        )
        const component = wrapper.find('ChargeCustomer').instance()
        // manully call onToken method
        component.onToken({ id: 'abc123' }, createOrderMock)
        expect(createOrderMock).toHaveBeenCalled()
        expect(createOrderMock).toHaveBeenCalledWith({ variables: { token: 'abc123' } })
    })

    it('turns the progress bar on', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ChargeCustomer />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        NProgress.start = jest.fn()
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz789' } },
        })
        const component = wrapper.find('ChargeCustomer').instance()

        component.onToken({ id: 'abc123' }, createOrderMock)
        expect(NProgress.start).toHaveBeenCalled()
    })

    it('routes to the order page when completed', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ChargeCustomer />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz789' } },
        })
        const component = wrapper.find('ChargeCustomer').instance()
        Router.router.push = jest.fn()

        component.onToken({ id: 'abc123' }, createOrderMock)
        await wait()
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: '/order',
            query: {
                id: 'xyz789',
            },
        })
    })
})
