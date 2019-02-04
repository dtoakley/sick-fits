import React, {Component} from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION(
        $email: String!
        $password: String!
    ) {
        signin(email: $email, password: $password) {
            id
            name
            email
        }
    }
`

const initialState = {
    email: '',
    password: '',
}

class Signin extends Component {

    state = initialState

    handleChange = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <Mutation
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY }
                ]}
            >
                {(signin, {error, loading}) => (
                    <Form
                        method="post"
                        onSubmit={async event => {
                            event.preventDefault()
                            await signin()
                            this.setState(initialState)
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign into your account</h2>
                            <ErrorMessage error={error} />
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
                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit">Sign in</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}


export default Signin;
