import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Order, { GET_ORDER_QUERY } from '../../components/Order'
import { testOrder } from '../../lib/testUtils'

const mocks = [
    {
        request: { query: GET_ORDER_QUERY, variables: { id: 'ord123' } },
        result: { data: { order: testOrder() } },
    },
]

describe('<Order/>', () => {
    it('renders and matches snapshot', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Order id="ord123" />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const order = wrapper.find('div[data-test="order"]')
        expect(toJSON(order)).toMatchSnapshot()
    })
})
