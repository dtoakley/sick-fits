import React, {Component} from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Head from 'next/head'

import ErrorMessage from './ErrorMessage'

const ItemDetailsStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .details {
      margin: 3rem;
      font-size: 2rem;
    }
`

const ITEM_DETAILS_QUERY = gql`
    query ITEM_DETAILS_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            largeImage
            price
        }
    }
`


class ItemDetails extends Component {
    render() {
        return (
            <Query
                query={ITEM_DETAILS_QUERY}
                variables={{
                    id: this.props.id,
                }}>
                {({data, error, loading}) => {
                    if (error) return <ErrorMessage error={error} />
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No item found for ID: {this.props.id}</p>

                    const item = data.item
                    return (
                        <ItemDetailsStyles>
                            <Head>
                                <title>Sick Fits | {item.title}</title>
                            </Head>
                            <img src={item.largeImage} alt={item.title} />
                            <div className="details">
                                <h2>Viewing {item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </ItemDetailsStyles>
                    )
                }}
            </Query>
        );
    }
}

export default ItemDetails;
export { ITEM_DETAILS_QUERY }
