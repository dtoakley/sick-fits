import React, {Component} from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $name: String!
        $email: String!
        $password: String!
    ) {
        signup(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`

const initialState = {
    name: '',
    email: '',
    password: '',
}

class Signup extends Component {

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
                mutation={SIGNUP_MUTATION}
                variables={this.state}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY }
                ]}
            >
                {(signup, {error, loading}) => (
                    <Form
                        method="post"
                        onSubmit={async event => {
                            event.preventDefault()
                            await signup()
                            this.setState(initialState)
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign up for an account</h2>
                            <ErrorMessage error={error} />
                            <label htmlFor="name">
                                Name
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </label>
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
                            <button type="submit">Sign up</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}


export default Signup;
export { SIGNUP_MUTATION }
