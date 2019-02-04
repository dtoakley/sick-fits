import React, {Component} from 'react';

import { possiblePermissions } from '../config'
import SickButton from './styles/SickButton'

class PermissionsUser extends Component {
    render() {

        const user = this.props.user
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => (
                    <td>
                        <label htmlFor={`${user.id}-permission-${permission}`}>
                            <input type="checkbox" />
                        </label>
                    </td>
                ))}
                <td>
                    <SickButton>Update</SickButton>
                </td>
            </tr>

        );
    }
}

export default PermissionsUser
