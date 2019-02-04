import React, {Component} from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { GET_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`

class DeleteItem extends Component {

    update = (cache, payload) => {

        // Read the cache for the items
        const data = cache.readQuery({ query: GET_ITEMS_QUERY })

        // Filter the deleted item from the items in the cache
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)

        // Re-write items to the cache.
        cache.writeQuery({ query: GET_ITEMS_QUERY, data })
    }

    render() {
        return (
            <Mutation
                mutation={DELETE_ITEM_MUTATION}
                variables={{id: this.props.id}}
                update={this.update}
            >
                {(deleteItem, { error }) => (
                    <button onClick={() => {
                        if(confirm('Are you sure you want to delete this?')) {
                            deleteItem().catch(err => {
                                alert(err.message)
                            })
                        }
                    }}>
                        {this.props.children}
                    </button>
                )}

            </Mutation>

        )
    }
}

export default DeleteItem
