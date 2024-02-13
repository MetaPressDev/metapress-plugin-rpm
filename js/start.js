import metadata from '../package.json'

import Content from './ui/Content'
import Picker from './ui/Picker'

/**
 * Allow usage of Ready Player Me avatars in MetaPress.
 */
export default class ReadyPlayerMePlugin {

    // Plugin information
    id              = metadata.metapress?.id || metadata.name
    name            = metadata.metapress?.name || metadata.name
    description     = metadata.metapress?.description || metadata.description
    version         = metadata.version
    provides        = [ ]
    requires        = [ ]

    /** Reference to the current resolve method */
    avatarResolve = null

    /** Reference to the current reject method */
    avatarReject = null

    /**
     * Called when the content window has been closed.
     * @param {boolean} fromUser `true` if the user closed the window, `false` otherwise.
     */
    onContentClose = fromUser => {
        if (!fromUser) {
            return
        }

        this.avatarReject?.(new Error('User cancelled avatar creation'))
        this.avatarReject = null
    }

    /**
     * Called when an avatar has been chosen.
     * @param {object} data Data about avatar that was exported.
     * @param {string} data.modelURL URL for the actual avatar model.
     * @param {string} data.modelID Identifier for the avatar model.
     */
    onAvatarExported = data => {
        this.avatarResolve(data)
        this.activeEditorResolve = null
        this.activeEditorReject = null
    }

    /** Shows a picker for the user to select between current avatar and new one */
    showPicker() {
        return new Promise((resolve, reject) => {
            // Called when user has closed the picker
            const onClose = () => {
                resolve(null)
            }

            // Called when a choice has been made
            const onChoice = data => {
                try {

                    if (data.choice === 'previous') {
                        resolve({ type: 'previous' })
                    } else {
                        resolve({ type: 'new' })
                    }

                } catch (err) {
                    resolve(null)
                }
            }

            metapress.dialogs.show({
                title: 'Choose Avatar',
                noHeader: true,
                content: <Picker onChoice={onChoice} onClose={onClose} />
            })
        })
    }

    /** Fetches the URL for the model */
    getModelURL = async () => {
        const previousModelURL = metapress.profile.get('rpm_model_url')
        let pickerResult = null

        if (previousModelURL) {
            pickerResult = await this.showPicker()

            // User wants to use the previous model
            if (pickerResult && pickerResult.type === 'previous') {
                return previousModelURL
            }
        }

        const modelDialog = metapress.dialogs.show({
            title: 'Ready Player Me',
            noHeader: true,
            content: <Content onAvatarExported={this.onAvatarExported} onClose={this.onContentClose} />
        })

        // Wait for it to finish
        let data = await new Promise((resolve, reject) => {
            this.activeEditorResolve = resolve
            this.avatarReject = reject
        })

        // Close the dialog window
        modelDialog.close()
        this.onContentClose(false)

        let modelURL = data.modelURL
        let modelID = data.modelID

        // Add cache buster field to URL
        modelURL += (modelURL.includes('?') ? '&' : '?') + '_=' + Date.now()

        // Done
        return { url: modelURL, modelID }
    }

    /** Called when we should register the avatar */
    $getAvatarConfigurations() {
        return {

            // Standard
            'avatar_id': 'extra.rpm',
            'avatar_image': require('../images/rpm-icon.jpg'),
            'avatar_name': 'Ready Player Me',
            'avatar_description': 'Ready Player Me avatar.',
            'avatar_height': 1.8,
            'avatar_walkSpeed': 1.2,
            'avatar_runSpeed': 4,
            'extra_offset_y': 0,
            'url': '',
            getURL: this.getModelURL,

            // Object info
            'type': 'mesh',
            'mesh_bounding_box': true,

            // Avatar controller
            'modifier:avatar-controller': true,

            // Attach physics
            'modifier:physics': true,
            'physics_enabled': true,
            'physics_shape': 'capsule',
            'physics_lockRotation': true,
            'physics_anchorBottom': true,
            'physics_kinematicVelocity': true,

            // Apply transform smoothing
            'modifier:transform-smoothing': true,

            // Ensure the model faces the direction it's moving
            'modifier:face-movement-direction': true,

            // Enable animations
            'modifier:animator': true,

        }
    }

}
