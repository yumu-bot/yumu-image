import Provider from './Provider.js';

/**
 * A {@link Provider} implementation to support WebP as an output format for SVG conversion.
 *
 * @public
 */
export default class WEBPProvider extends Provider {

    /**
     * @inheritdoc
     * @override
     */
    getBackgroundColor(options) {
        // WebP 支持透明背景，如果不传，默认设为透明（transparent）
        // 如果你的业务需要默认白色背景，可以改成 options.background || '#FFF'
        return options.background || 'transparent';
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
        return { quality: options.quality };
    }

    /**
     * @inheritdoc
     * @override
     */
    getType() {
        return 'webp';
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