import React, {Component} from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'


const GET_ITEM_QUERY = gql`
    query GET_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
    $id: ID! 
    $title: String
    $description: String
    $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`

class UpdateItem extends Component {
    state = {}

    handleChange = event => {
        const { name , type, value } = event.target
        const val = type === 'number' ? parseFloat(value) : value
        this.setState({
            [name]: val
        })
    }

    handleUpdateItem = async (event, updateItemMutation) => {
        event.preventDefault()
        const response = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state,
            }
        })

        console.log(response)
    }

    render() {
        return (
            <Query query={GET_ITEM_QUERY} variables={{id: this.props.id}}>
                {({data, loading}) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No item found for ID: {this.props.id}</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={event => this.handleUpdateItem(event, updateItem)}>
                                    <ErrorMessage error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="Title"
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea
                                                id="description"
                                                name="description"
                                                placeholder="Enter a description"
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                placeholder="Price"
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </label>
                                        <button type="submit">
                                            Sav{loading ? 'ing' : 'e'} changes
                                        </button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        );
    }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
