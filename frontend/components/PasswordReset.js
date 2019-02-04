import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION(
        $resetToken: String!,
        $password: String!,
        $confirmPassword: String!
    ) {
        resetPassword(
            resetToken: $resetToken, 
            password: $password, 
            confirmPassword: $confirmPassword
        ) {
            id
            email
            name
        }
    }
`

class PasswordReset extends Component {

    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }

    state = {
        password: '',
        confirmPassword: ''
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
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    ...this.state
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(requestPasswordReset, {error, loading, called}) => (
                    <Form
                        method="post"
                        onSubmit={async event => {
                            event.preventDefault()
                            await requestPasswordReset()
                            this.setState({ password: '', confirmPassword: ''})
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset your password</h2>
                            <ErrorMessage error={error} />
                            <label htmlFor="password">
                                New password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm your password
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={this.state.confirmPassword}
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


export default PasswordReset;
