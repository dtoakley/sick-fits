import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'

import Nav from '../../components/Nav'
import { CURRENT_USER_QUERY} from '../../components/User'
import { MockedProvider } from 'react-apollo/test-utils'
import { testUser, testCartItem } from '../../lib/testUtils'

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null } },
    },
]

const signedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: testUser() } },
    },
]

const signedInMocksWithCartItems = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: {
            data: {
                me: {
                    ...testUser(),
                    cart: [testCartItem(), testCartItem(), testCartItem()],
                },
            },
        },
    },
]

describe('<Nav />', () => {
    it('renders a minimal nav when signed out', async () => {
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <Nav />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const nav = wrapper.find('ul[data-test="nav"]')
        expect(toJSON(nav)).toMatchSnapshot()
    })

    it('Renders full nav when signed in', async () => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocks}>
                <Nav />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const nav = wrapper.find('ul[data-test="nav"]')
        expect(nav.children().length).toBe(6)
        expect(nav.text()).toContain('Sign out')
    })

    it('renders the amount of items in the cart', async () => {
        const wrapper = mount(
            <MockedProvider mocks={signedInMocksWithCartItems}>
                <Nav />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const nav = wrapper.find('[data-test="nav"]')
        const count = nav.find('div.count')
        expect(count.text()).toEqual('9')
        expect(toJSON(count)).toMatchSnapshot()
    })
})