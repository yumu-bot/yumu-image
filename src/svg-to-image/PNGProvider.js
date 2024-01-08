import Provider from './Provider.js';

/**
 * A {@link Provider} implementation to support PNG as an output format for SVG conversion.
 *
 * @public
 */
export default class PNGProvider extends Provider {

    /**
     * @inheritdoc
     * @override
     */
    getBackgroundColor(options) {
        return options.background || 'transparent';
    }

    /**
     * @inheritdoc
     * @override
     */
    getCLIOptions() {
        return null;
    }

    /**
     * @inheritdoc
     * @override
     */
    getScreenshotOptions(options) {
        return {omitBackground: !options.background};
    }

    /**
     * @inheritdoc
     * @override
     */
    getType() {
        return 'png';
    }

    /**
     * @inheritdoc
     * @override
     */
    parseAPIOptions() {
    }

    /**
     * @inheritdoc
     * @override
     */
    parseCLIOptions() {
    }

}
