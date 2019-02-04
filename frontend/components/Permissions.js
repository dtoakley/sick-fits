import React from 'react';
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import ErrorMessage from './ErrorMessage'
import Table from './styles/Table'
import { possiblePermissions } from '../config'
import PermissionsUser from './PermissionsUser'

const GET_USERS_QUERY = gql`
    query GET_USERS_QUERY {
        users {
            id
            name
            email
            permissions    
        }
    }
`

const Permissions = props => (
    <Query query={GET_USERS_QUERY}>
        {({data, loading, error}) => (
            <div>
                <ErrorMessage error={error} />
                <div>
                    <h1>Manage Permissions</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <PermissionsUser
                                key={user.id}
                                user={user}
                                />
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
)

export default Permissions
