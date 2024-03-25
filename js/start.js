import React from 'react'

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
    requires        = [ 'backend', 'entities', 'dialogs', 'profile' ]

    /** Reference to the current resolve method */
    avatarResolve = null

    /** Called when the plugin is loaded */
    async onLoad() {
        // Ensure we have access to the entities
        while (!metapress?.entities) {
            await new Promise(c => setTimeout(c, 250))
        }

        // Register idle animation
        metapress.entities.add({
            type: 'animation',
            url: require('./animations/animation_idle.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.idle',
        })

        // Register walk animation
        metapress.entities.add({
            type: 'animation',
            url: require('./animations/animation_walk.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.walk',
        })

        // Register run animation
        metapress.entities.add({
            type: 'animation',
            url: require('./animations/animation_run.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.run',
        })

        // Jump animation
        metapress.entities.add({
            type: 'animation',
            url: require('./animations/animation_jump.fbx'),
            animation_cache_priority: 1,
            animation_slice: [
                { from: 0.0, to: 0.4, name: 'rpm.jump_start' },
                { from: 0.4, to: 0.6, name: 'rpm.jump_loop', scale: 8 },
                { from: 0.6, to: 1.0, name: 'rpm.jump_end' },
            ]
        })
         // Animated Emojis

         // Register cry animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/cry.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.cry',
        })

         // Register dance animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/dance.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.dance',
        })

         // Register laugh animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/laugh.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.laugh',
        })

         // Register love animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/love.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.love',
        })

         // Register mindblown animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/mindblown.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.mindblown',
        })

         // Register party animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/party.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.party',
        })

         // Register raise animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/raise.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.raise',
        })

         // Register rock animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/rock.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.rock',
        })

         // Register salute animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/salute.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.salute',
        })

         // Register sing animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/sing.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.sing',
        })

         // Register thumbsup animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/thumbsup.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.thumbsup',
        })

         // Register wave animation
         metapress.entities.add({
            type: 'animation',
            url: metapress.backend.getAsset('emoji-animations/wave.fbx'),
            animation_cache_priority: 1,
            animation_name_override: 'rpm.wave',
        })

        
    }

    /**
     * Called when the content window has been closed.
     * @param {boolean} fromUser `true` if the user closed the window, `false` otherwise.
     */
    onContentClose = fromUser => {
        if (!fromUser) {
            return
        }

        this.avatarResolve?.({ error: 'User cancelled avatar creation.' })
        this.avatarResolve = null
    }

    /**
     * Called when an avatar has been chosen.
     * @param {object} data Data about avatar that was exported.
     * @param {string} data.modelURL URL for the actual avatar model.
     * @param {string} data.modelID Identifier for the avatar model.
     */
    onAvatarExported = data => {
        this.avatarResolve?.(data)
        this.avatarResolve = null
    }

    /** Shows a picker for the user to select between current avatar and new one */
    showPicker() {
        return new Promise(async (resolve, reject) => {
            let isSuccessful = false

            // Called when we are finished with the picker
            const finish = (data, success) => {
                isSuccessful = success
                pickerDialog?.close?.()
                resolve(data)
            }

            // Called when user has closed the picker
            const onClose = () => {
                finish(null, false)
            }

            // Called when a choice has been made
            const onChoice = data => {

                try {
                    if (!data || typeof data != 'object' || !data.choice) {
                        throw new Error('Invalid data from choice.')
                    }

                    if (data.choice === 'previous') {
                        finish({ type: 'previous' }, true)
                    } else {
                        finish({ type: 'new' }, true)
                    }

                } catch (err) {
                    finish(null, false)
                }
            }

            const pickerDialog = metapress.dialogs.show({
                title: 'Choose Avatar',
                noHeader: true,
                hideMetaverseButton: true,
                content: <Picker onChoice={onChoice} onClose={onClose} />
            })

            while (!pickerDialog.isClosed) {
                if (isSuccessful) {
                    break
                }

                await new Promise(c => setTimeout(c, 250))
            }

            if (!isSuccessful) {
                finish(null, false)
            }
        })
    }

    /** Fetches the URL for the model */
    getModelURL = async () => {
        const previousModelURL = metapress.profile.get('rpm_model_url')
        let pickerResult = null

        if (previousModelURL) {
            pickerResult = await this.showPicker()

            // User has closed picker
            if (!pickerResult) {
                return null
            }

            // User wants to use the previous model
            if (pickerResult.type === 'previous') {
                return previousModelURL
            }
        }

        const modelDialog = metapress.dialogs.show({
            title: 'Create your own',
            noHeader: true,
            hideMetaverseButton: true,
            content: <Content onAvatarExported={this.onAvatarExported} onClose={this.onContentClose} />
        })

        // Wait for it to finish
        let data = await new Promise((resolve, reject) => {
            this.avatarResolve = resolve
        })

        // Close the dialog window
        modelDialog.close()
        this.onContentClose(false)

        if (!data || data.error) {
            throw new Error(data?.error || 'User cancelled avatar creation.')
        }

        let modelURL = data.modelURL
        let modelID = data.modelID

        // Add cache buster field to URL
        modelURL += (modelURL.includes('?') ? '&' : '?') + '_=' + Date.now()

        // Done
        metapress.profile.set('rpm_model_url', modelURL)
        return { url: modelURL, modelID }
    }

    /** Called when we should register the avatar */
    $getAvatarConfigurations() {
        return {

            // Standard
            'avatar_id': 'extra.rpm',
            'avatar_image': require('../images/rpm-icon.jpg'),
            'avatar_name': 'Create your own',
            'avatar_description': 'Ready Player Me avatar.',
            'avatar_skeletonType': 'rpm',
            'avatar_height': 1.8,
            'avatar_walkSpeed': 1.2,
            'avatar_runSpeed': 4,
            'extra_offset_y': 0,
            'order': -10,
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
