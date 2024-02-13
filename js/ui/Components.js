import React from 'react'

/**
 * Header component with a close button.
 * @param {object} props Header properties.
 * @param {string} props.title Title for the header.
 * @param {Function} props.onClose Called when the close button is clicked.
 */
export const Header = props => {
    return <div style={{ display: 'flex', height: 40, flex: '0 0 auto', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>

        {/* Title */}
        <div style={{ fontSize: 15, margin: '0px 20px', flex: '1 1 1px' }}>
            { props.title }
        </div>

        {/* Close button */}
        <div title='Close' onClick={evt => props.onClose(true)} style={{ width: 24, height: '100%', flex: '0 0 auto', cursor: 'pointer', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${require('../../images/close.svg')})` }} />
        <div style={{ width: 10, flex: '0 0 auto' }} />

    </div>
}

/**
 * Container component to house elements.
 * @param {object} props Container properties.
 * @param {React.ReactNode} props.children Child elements.
 */
export const Container = props => {
    return <div style={{ flex: '1 1 1px', maxHeight: 'calc(100% - 40px)', position: 'relative' }}>
        { props.children }
    </div>
}
