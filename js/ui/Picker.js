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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30, padding: 20 }}>
                    <div style={{ fontSize: 16, color: '#D9D9D9', textAlign: 'center' }}>
                        We have detected that you have a previous avatar saved.<br/>
                        Would you like to use that avatar, or create a new one?
                    </div>

                    <Button icon={require('../../images/previous.svg')} title='Use Previous Avatar' primary='#206173' secondary='#133d49' onClick={e => this.props.onChoice({ choice: 'previous' })} />
                    <Button icon={require('../../images/new.svg')} title='Create New Avatar' primary='#207344' secondary='#185934' onClick={e => this.props.onChoice({ choice: 'new' })} />
                </div>
            </Container>
        </>
    }

}

/**
 * Button.
 * @param {object} props Button properties.
 * @param {string} props.title Button title.
 * @param {string} props.icon Button icon.
 * @param {string} props.primary Primary color for the button.
 * @param {string} props.secondary Secondary color for the button.
 * @param {Function} props.onClick Called when the button is clicked.
 */
const Button = props => {
    return <div onClick={props.onClick} style={{ display: 'flex', width: '100%', height: 80, color: '#FFF', fontSize: 20, backgroundColor: props.primary, boxSizing: 'border-box', borderRadius: 10, boxShadow: `0 0.4rem 0 0 ${props.secondary}e6, 0 5px 10px 0px rgba(0, 0, 0, 0.6)`, cursor: 'pointer', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
        { props.icon
            ? <img src={props.icon} style={{ width: 30, height: 30, marginRight: 20 }} />
            : null
        }

        { props.title }
    </div>
}
