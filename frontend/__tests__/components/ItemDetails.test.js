import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'

import ItemDetails, { ITEM_DETAILS_QUERY } from '../../components/ItemDetails'
import { MockedProvider } from 'react-apollo/test-utils'
import { testItem } from '../../lib/testUtils'


describe('<ItemDetails />' , () => {
    it('renders with proper data', async () => {
        const mocks = [
            {
                // when someone makes a request with this query and variable combo
                request: { query: ITEM_DETAILS_QUERY, variables: { id: '123' } },
                // return this fake data (mocked data)
                result: {
                    data: {
                        item: testItem(),
                    },
                },
            },
        ]
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ItemDetails id="123" />
            </MockedProvider>
        )
        expect(wrapper.text()).toContain('Loading...')
        await wait()
        wrapper.update()
        expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()
        expect(toJSON(wrapper.find('img'))).toMatchSnapshot()
        expect(toJSON(wrapper.find('p'))).toMatchSnapshot()
    })

    it('Errors with a not found item', async () => {
        const mocks = [
            {
                request: { query: ITEM_DETAILS_QUERY, variables: { id: '123' } },
                result: {
                    errors: [{ message: 'Item not found'}]
                },
            }
        ]
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ItemDetails id="123" />
            </MockedProvider>
        )
        await wait()
        wrapper.update()
        const item = wrapper.find('[data-test="graphql-error"]')
        expect(item.text()).toContain('Item not found')
        expect(toJSON(item)).toMatchSnapshot()
    })
})


