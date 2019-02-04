import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { possiblePermissions } from '../config'
import SickButton from './styles/SickButton'
import ErrorMessage from './ErrorMessage'


const UPDATE_USER_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_USER_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
        updateUserPermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
        }
 
    }
`
class PermissionsUser extends Component {

    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            email: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired
    }

    state = {
        permissions: this.props.user.permissions
    }

    handlePermissionChange = event => {
        const checkbox = event.target
        let permissions = [...this.state.permissions]
        if (checkbox.checked) {
            permissions.push(checkbox.value)
        } else {
            permissions = permissions.filter(permission => permission !== checkbox.value)
        }
        this.setState({ permissions: permissions})
    }

    render() {
        const user = this.props.user
        return (
            <Mutation
                mutation={UPDATE_USER_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }}
            >
                {(updateUserPermissions, {loading, error}) => (
                    <>
                    {error && <tr>
                        <td colspan="8">
                            <ErrorMessage error={error} />
                        </td>
                    </tr>}
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {possiblePermissions.map(permission => (
                                <td key={permission}>
                                    <label htmlFor={`${user.id}-permission-${permission}`}>
                                        <input
                                            id={`${user.id}-permission-${permission}`}
                                            type="checkbox"
                                            checked={this.state.permissions.includes(permission)}
                                            value={permission}
                                            onChange={this.handlePermissionChange}
                                        />
                                    </label>
                                </td>
                            ))}
                            <td>
                                <SickButton
                                    type="button"
                                    onClick={updateUserPermissions}
                                    disabled={loading}
                                >
                                    Updat{loading ? 'ing' : 'e'}
                                </SickButton>
                            </td>
                        </tr>
                    </>
                )}
            </Mutation>
        );
    }
}

export default PermissionsUser
