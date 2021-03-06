import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'

import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

const Pagination = props => {
    return (
        <Query query={PAGINATION_QUERY}>
            {({data, loading, error}) => {
                if (loading) return <p>Loading..</p>
                const itemsCount = data.itemsConnection.aggregate.count
                const numberOfPages = Math.ceil(itemsCount / perPage)
                const page = props.page;
                return (
                    <PaginationStyles data-test="pagination">
                        <Head>
                            <title>
                                Sick Fits | Page {page} of {numberOfPages}
                            </title>
                        </Head>
                        <Link
                            prefetch
                            href={{
                                pathname: 'items',
                                query: { page: page - 1 }
                        }}>
                            <a className="prev" aria-disabled={page <= 1}>←️ Prev</a>
                        </Link>
                        <p>
                            Page {page} of <span className="totalPages">{numberOfPages}</span>
                        </p>
                        <Link
                            prefetch
                            href={{
                                pathname: 'items',
                                query: { page: page + 1 }
                            }}>
                            <a className="next" aria-disabled={page >= numberOfPages}>Next →</a>
                        </Link>
                    </PaginationStyles>
                )
            }}
        </Query>
    );
};

export default Pagination;
export { PAGINATION_QUERY }
