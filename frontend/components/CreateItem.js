import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import ErrorMessage from './ErrorMessage'


const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $image: String
        $largeImage: String
        $price: Int!
    ) {
        createItem(
            title: $title
            description: $description
            image: $image
            largeImage: $largeImage
            price: $price
        ) {
            id
        }
    }
`

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    }

    handleChange = event => {
        const { name , type, value } = event.target
        const val = type === 'number' ? parseFloat(value) : value
        this.setState({
            [name]: val
        })
    }

   uploadFile = async event => {
        const files = event.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'sick-fits')

       const response = await fetch('https://api.cloudinary.com/v1_1/dtoakley/image/upload', {
            method: 'POST',
            body: data
       })
       const file = await response.json()

       this.setState({
           image: file.secure_url,
           largeImage: file.eager[0].secure_url
       })
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error, called, data }) => (
                <Form  onSubmit={async event => {
                    event.preventDefault()
                    const response = await createItem()
                    Router.push({
                        pathname: '/item',
                        query: { id: response.data.createItem.id }
                    })
                }}>
                    <ErrorMessage error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                        <label htmlFor="title">
                            Title
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                value={this.state.title}
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
                                value={this.state.description}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="file">
                            Image
                            <input
                                type="file"
                                id="file"
                                name="file"
                                placeholder="Upload an image"
                                onChange={this.uploadFile}
                                required
                            />
                            {this.state.image && <img width="200" src={this.state.image} alt="Upload Preview" />}
                        </label>
                        <label htmlFor="price">
                            Price
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Price"
                                value={this.state.price}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        <button type="submit">
                            Submit
                        </button>
                    </fieldset>
                </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem
export { CREATE_ITEM_MUTATION }


