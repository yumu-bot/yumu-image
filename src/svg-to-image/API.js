import Converter from './Converter.js';

const _provider = Symbol('provider');

function omit(object, props) {
    let o = { ...object}
    delete o[props];
    return o;
}
function pick(object, props) {
    let o = {}
    if (props in object)o[props] = object[props];
    return o;
}
/**
 * The application programming interface for a SVG converter {@link Provider}.
 *
 * @public
 */
export class API {
    /**
     * Creates an instance of {@link API} using the specified <code>provider</code>.
     *
     * @param {Provider} provider - the {@link Provider} to be used
     * @public
     */
    constructor(provider) {
        this[_provider] = provider;

        // Workaround for #22 by ensuring all public methods are bound to this instance
        this.convert = this.convert.bind(this);
        this.convertFile = this.convertFile.bind(this);
        this.createConverter = this.createConverter.bind(this);
    }

    /**
     * Converts the specified <code>input</code> SVG into another format using the <code>options</code> provided via a
     * headless Chromium instance.
     *
     * <code>input</code> can either be a SVG buffer or string.
     *
     * If the width and/or height cannot be derived from <code>input</code> then they must be provided via their
     * corresponding options. This method attempts to derive the dimensions from <code>input</code> via any
     * <code>width</code>/<code>height</code> attributes or its calculated <code>viewBox</code> attribute.
     *
     * This method is resolved with the converted output buffer.
     *
     * An error will occur if both the <code>baseFile</code> and <code>baseUrl</code> options have been provided,
     * <code>input</code> does not contain an SVG element or no <code>width</code> and/or <code>height</code> options were
     * provided and this information could not be derived from <code>input</code>.
     *
     * @param {Buffer|string} input - the SVG input to be converted to another format
     * @param {API~ConvertOptions} [options] - the options to be used
     * @return {Promise<Buffer>} A <code>Promise</code> that is resolved with the converted output buffer.
     * @public
     */
    async convert(input, options) {
        const converter = this.createConverter(pick(options, 'puppeteer'));
        let output;

        try {
            output = await converter.convert(input, omit(options, 'puppeteer'));
        } finally {
            await converter.destroy();
        }

        return output;
    }

    /**
     * Converts the SVG file at the specified path into another format using the <code>options</code> provided and writes
     * it to the output file.
     *
     * The output file is derived from <code>inputFilePath</code> unless the <code>outputFilePath</code> option is
     * specified.
     *
     * If the width and/or height cannot be derived from the input file then they must be provided via their corresponding
     * options. This method attempts to derive the dimensions from the input file via any
     * <code>width</code>/<code>height</code> attributes or its calculated <code>viewBox</code> attribute.
     *
     * This method is resolved with the path of the converted output file for reference.
     *
     * An error will occur if both the <code>baseFile</code> and <code>baseUrl</code> options have been provided, the
     * input file does not contain an SVG element, no <code>width</code> and/or <code>height</code> options were provided
     * and this information could not be derived from input file, or a problem arises while reading the input file or
     * writing the output file.
     *
     * @param {string} inputFilePath - the path of the SVG file to be converted to another file format
     * @param {API~ConvertFileOptions} [options] - the options to be used
     * @return {Promise<string>} A <code>Promise</code> that is resolved with the output file path.
     * @public
     */
    async convertFile(inputFilePath, options) {
        const converter = this.createConverter(pick(options, 'puppeteer'));
        let outputFilePath;

        try {
            outputFilePath = await converter.convertFile(inputFilePath, omit(options, 'puppeteer'));
        } finally {
            await converter.destroy();
        }

        return outputFilePath;
    }

    /**
     * Creates an instance of {@link Converter} using the <code>options</code> provided.
     *
     * It is important to note that, after the first time either {@link Converter#convert} or
     * {@link Converter#convertFile} are called, a headless Chromium instance will remain open until
     * {@link Converter#destroy} is called. This is done automatically when using the {@link API} convert methods,
     * however, when using {@link Converter} directly, it is the responsibility of the caller. Due to the fact that
     * creating browser instances is expensive, this level of control allows callers to reuse a browser for multiple
     * conversions. For example; one could create a {@link Converter} and use it to convert a collection of SVG files to
     * files in another format and then destroy it afterwards. It's not recommended to keep an instance around for too
     * long, as it will use up resources.
     *
     * @param {API~CreateConverterOptions} [options] - the options to be used
     * @return {Converter} A newly created {@link Converter} instance.
     * @public
     */
    createConverter(options) {
        return new Converter(this.provider, options);
    }

    /**
     * Returns the {@link Provider} for this {@link Converter}.
     *
     * @return {Provider} The provider.
     * @public
     */
    get provider() {
        return this[_provider];
    }

    /**
     * Returns the current version of the SVG converter provider.
     *
     * @return {string} The version.
     * @public
     */
    get version() {
        return this.provider.getVersion();
    }

}
