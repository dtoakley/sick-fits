import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'

import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from '../../components/RemoveFromCart'
import { CURRENT_USER_QUERY } from '../../components/User'
import { testUser, testCartItem } from '../../lib/testUtils'

global.alert = jest.fn()

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...testUser(),
                    cart: [testCartItem({ id: 'abc123' })],
                },
            },
        },
    },
    {
        request: { query: REMOVE_FROM_CART_MUTATION, variables: { id: 'abc123' } },
        result: {
            data: {
                removeFromCart: {
                    __typename: 'CartItem',
                    id: 'abc123',
                },
            },
        },
    },
];


describe('<RemoveFromCart/>', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(
            <MockedProvider>
                <RemoveFromCart id="abc123" />
            </MockedProvider>
        )
        expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
    })

    it('removes item successfully from cart', async () => {
        let apolloClient
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client
                        return <RemoveFromCart id="abc123" />
                    }}
                </ApolloConsumer>
            </MockedProvider>
        )

        const {data: {me: m2}} = await apolloClient.query({ query: CURRENT_USER_QUERY })
        expect(m2.cart).toHaveLength(1)
        expect(m2.cart[0].id).toBe('abc123')
        expect(m2.cart[0].item.price).toBe(5000)

        wrapper.find('button').simulate('click')
        await wait()

        const {data: {me: m3}} = await apolloClient.query({ query: CURRENT_USER_QUERY })
        expect(m3.cart).toHaveLength(0)
    })
})
