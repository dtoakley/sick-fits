import App, { Container } from 'next/app'

import Page from '../components/Page'

class SickFitsApp extends App {
    render() {
        const { Component } = this.props

        return (
            <Container>
                <Page>
                    <Component />
                </Page>
            </Container>
        )
    }
}

export default SickFitsApp
