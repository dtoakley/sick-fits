import React, {Component} from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

const REQUEST_PASSWORD_RESET_MUTATION = gql`
    mutation REQUEST_PASSWORD_RESET_MUTATION(
        $email: String!
    ) {
        requestPasswordReset(email: $email) {
            message
        }
    }
`

class RequestPasswordReset extends Component {

    state = {
        email: ''
    }

    handleChange = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <Mutation
                mutation={REQUEST_PASSWORD_RESET_MUTATION}
                variables={this.state}
            >
                {(requestPasswordReset, {error, loading, called}) => (
                    <Form
                        data-test="form"
                        method="post"
                        onSubmit={async event => {
                            event.preventDefault()
                            await requestPasswordReset()
                            this.setState({ email: '' })
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Request password reset</h2>
                            <ErrorMessage error={error} />
                            {!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
                            <label htmlFor="email">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}


export default RequestPasswordReset;
export { REQUEST_PASSWORD_RESET_MUTATION }
