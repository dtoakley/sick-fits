import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'

import RequestPasswordReset, { REQUEST_PASSWORD_RESET_MUTATION } from '../../components/RequestPasswordReset'

const mocks = [
    {
        request: {
            query: REQUEST_PASSWORD_RESET_MUTATION,
            variables: { email: 'test@test.com' },
        },
        result: {
            data: { requestPasswordReset: { message: 'success', __typename: 'Message' } },
        },
    },
]

describe('<RequestPasswordReset />', () => {
    it('Renders and matches snapshot', async () => {
        const wrapper = mount(
            <MockedProvider>
                <RequestPasswordReset />
            </MockedProvider>
        )
        const form = wrapper.find('form[data-test="form"]')
        expect(toJSON(form)).toMatchSnapshot()
    })

    it('Calls the mutation', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestPasswordReset />
            </MockedProvider>
        )
        // simulate typing an email
        wrapper
            .find('input')
            .simulate('change', { target: { name: 'email', value: 'test@test.com' } })
        // submit the form
        wrapper.find('form').simulate('submit')
        await wait(50)
        wrapper.update()
        expect(wrapper.find('p').text()).toContain('Success! Check your email for a reset link.')
    })
})
