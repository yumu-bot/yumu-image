import Provider from './Provider.js';

/**
 * A {@link Provider} implementation to support JPEG as an output format for SVG conversion.
 *
 * @public
 */
export default class JPEGProvider extends Provider {

    /**
     * @inheritdoc
     * @override
     */
    getBackgroundColor(options) {
        return options.background || '#FFF';
    }

    /**
     * @inheritdoc
     * @override
     */
    getCLIOptions() {
        return [
            {
                flags: '--quality <value>',
                description: `specify quality for ${this.getFormat()} [100]`,
                transformer: parseInt
            }
        ];
    }

    /**
     * @inheritdoc
     * @override
     */
    getScreenshotOptions(options) {
        return {quality: options.quality};
    }

    /**
     * @inheritdoc
     * @override
     */
    getType() {
        return 'jpeg';
    }

    /**
     * @inheritdoc
     * @override
     */
    parseAPIOptions(options) {
        if (typeof options.quality === 'number' && (options.quality < 0 || options.quality > 100)) {
            throw new Error('Value for quality option out of range. Use value between 0-100 (inclusive)');
        }
        if (options.quality == null) {
            options.quality = 100;
        }
    }

    /**
     * @inheritdoc
     * @override
     */
    parseCLIOptions(options, command) {
        options.quality = command.quality;
    }

}
