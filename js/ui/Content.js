import React from 'react'
import { Container, Header } from './Components'

/** URL for the content */
const URL = 'https://vatom.readyplayer.me/avatar?frameApi&bodyType=fullbody'

/**
 * Shows content from the Ready Player Me API.
 */
export default class Content extends React.PureComponent {

    /** @type {HTMLIFrameElement} */
    contentRef = null

    /** Called after first render */
    componentDidMount() {
        if (!this.contentRef?.contentWindow) {
            return
        }

        // Listen for any messages
        this.contentRef.contentWindow.addEventListener('message', this.onMessage)
    }

    /** Called when a message has been received */
    onMessage = msg => {
        // Ensure message is parseable
        try {
            if (typeof msg === 'string') {
                msg = JSON.parse(msg)
            }
        } catch (err) {
            return
        }

        if (msg.source == 'readyplayerme' && msg.eventName == 'v1.frame.ready') {

            // Frame has been loaded
            console.log('[ReadyPlayerMe] Frame loaded successfully.')
            this.contentRef.contentWindow.postMessage(JSON.stringify({
                target: 'readyplayerme',
                type: 'subscribe',
                eventName: 'v1.**'
            }))

        } else if (msg.source == 'readyplayerme' && msg.eventName == 'v1.avatar.exported') {

            // Extract model ID
            let modelID = /([0-9a-zA-Z]+)\.glb/g.exec(msg.data.url)[1]
            if (!modelID) {

                // Unknown URL format!
                console.warn(`[ReadyPlayerMe] Unexpected URL format returned. Attempting to continue with URL: "${msg.data.url}"`)
                this.props.onAvatarExported({ modelURL: msg.data.url, modelID: '' })
                return

            }

            // Supported morphs
            let morphs = [
                // Visemes
                `viseme_CH`, `viseme_DD`, `viseme_E`, `viseme_FF`, `viseme_I`, `viseme_O`, `viseme_PP`, `viseme_RR`, `viseme_SS`, `viseme_TH`, `viseme_U`, `viseme_aa`, `viseme_kk`, `viseme_nn`, `viseme_sil`,

                // Eye movements
                'eyeBlinkLeft', 'eyeBlinkRight', 'eyeLookDownLeft', 'eyeLookDownRight', 'eyeLookInLeft', 'eyeLookInRight', 'eyeLookOutLeft', 'eyeLookOutLeft', 'eyeLookOutRight', 'eyeLookUpLeft', 'eyeLookUpRight'
            ]

            // Get a lower LOD-level model through the RPM API
            let modelURL = `https://api.readyplayer.me/v1/avatars/${modelID}.glb?meshLod=2&textureAtlas=1024&morphTargets=${morphs.join(',')}`
            console.debug(`[ReadyPlayerMe] Fetched lower LOD-level model with URL: "${modelURL}"`)
            this.props.onAvatarExported({ modelURL, modelID })

        }
    }

    /** Render UI */
    render() {
        return <>
            <Header title='Ready Player Me' onClose={this.props.onClose} />

            <Container>
                <iframe ref={r => this.contentRef = r} src={URL} style={{ width: '100%', height: '100%', margin: 0, padding: 0, border: 'none' }} />
            </Container>
        </>
    }
}
