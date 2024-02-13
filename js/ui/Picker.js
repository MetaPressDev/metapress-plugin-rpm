import React from 'react'
import { Container, Header } from './Components'

/**
 * Allows the user to choose between selecting their previous Ready Player Me
 * avatar, or selecting a new avatar.
 */
export default class Picker extends React.PureComponent {

    /** Render UI */
    render() {
        return <>
            <Header title='Choose Avatar' onClose={this.props.onClose} />

            <Container>

            </Container>
        </>
    }

}
