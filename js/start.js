import metadata from '../package.json'

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

    /** Called on load */
    onLoad() {
        console.log(`[External] Loaded ${this.name}!`)
    }

}
