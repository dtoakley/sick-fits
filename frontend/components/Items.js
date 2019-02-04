import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

import Item from './Item'
import Pagination from './Pagination'
import { perPage } from '../config'

const GET_ITEMS_QUERY = gql`
    query GET_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
            id
            title
            description
            image
            largeImage
            price
        }
    }
`

const Center = styled.div`
  text-align: center;
`


const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

class Items extends Component {

    render() {
        return (
            <Center>
                <Pagination page={this.props.page} />
                    <Query
                        query={GET_ITEMS_QUERY}
                        // fetchpolicy="network-only"

                        variables={{
                            skip: this.props.page * perPage - perPage,
                        }}
                    >
                        {({ data, error, loading }) => {
                            if (loading) return <p>Loading..</p>
                            if (error) return <p> Error: { error.message }</p>
                            return <ItemsList>
                                    {data.items.map(item =>
                                        <Item key={item.id} item={item}>
                                            {item.title}
                                        </Item>
                                    )}
                            </ItemsList>
                        }}
                    </Query>
                <Pagination page={this.props.page} />
            </Center>
        )
    }
}

export default Items
export { GET_ITEMS_QUERY }
