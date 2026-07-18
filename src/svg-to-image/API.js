import Converter from './Converter.js';

const _provider = Symbol('provider');
const _cachedConverter = Symbol('cachedConverter');
const _taskCount = Symbol('taskCount'); // 新增：任务计数器
const _maxTasksPerBrowser = Symbol('maxTasksPerBrowser'); // 新增：重启阈值

function omit(object, props) {
    let o = { ...object}

    const keys = Array.isArray(props) ? props : [props];

    keys.forEach(prop => {
        if (prop in object) {
            delete o[prop]
        }
    });

    return o;
}

function pick(object, props) {
    let filtered = {};

    const keys = Array.isArray(props) ? props : [props];

    keys.forEach(prop => {
        if (prop in object) {
            filtered[prop] = object[prop];
        }
    });

    return filtered;
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
     * @param maxTasks
     * @public
     */
    constructor(provider, maxTasks = 500) {
        this[_provider] = provider;
        this[_cachedConverter] = null; // 初始化为空
        this[_taskCount] = 0; // 初始化计数器
        this[_maxTasksPerBrowser] = maxTasks;

        // Workaround for #22 by ensuring all public methods are bound to this instance
        this.convert = this.convert.bind(this);
        this.convertFile = this.convertFile.bind(this);
        this.createConverter = this.createConverter.bind(this);
    }

    /**
     * 内部管理方法：获取转换器并处理自动重启逻辑
     * @return Converter
     */
    async _getConverterWithLifecycle(options) {
        // 1. 检查是否达到重启阈值
        if (this[_cachedConverter] && this[_taskCount] >= this[_maxTasksPerBrowser]) {
            console.log(`[图片输出] 已达到 ${this[_taskCount]} 次任务，正在重启浏览器...`);

            const old = this[_cachedConverter];
            this[_cachedConverter] = null;
            this[_taskCount] = 0;

            if (old) {
                old.destroy().catch(err => {
                    console.error('[图片输出] 后台销毁旧浏览器失败:', err);
                });
            }
        }

        if (!this[_cachedConverter]) {
            this[_cachedConverter] = this.createConverter(pick(options, 'puppeteer'));
        }

        // 3. 增加计数并返回实例
        this[_taskCount]++;
        return this[_cachedConverter];
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
        // 修改：使用持久化实例，不再使用 try...finally 销毁
        const converter = await this._getConverterWithLifecycle(options);
        try {
            return await converter.convert(input, omit(options, 'puppeteer'));
        } finally {
            await converter.close()
        }
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
        // 修改：使用持久化实例
        const converter = await this._getConverterWithLifecycle(options);
        try {
            return await converter.convertFile(inputFilePath, omit(options, 'puppeteer'));
        } finally {
            await converter.close()
        }
    }

    /**
     * 手动销毁 API 关联的浏览器实例
     */
    async destroy() {
        if (this[_cachedConverter]) {
            // 调用 Converter.js 的销毁方法关闭浏览器并清理临时文件
            await this[_cachedConverter].destroy();
            this[_cachedConverter] = null;
        }
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

    get provider() { return this[_provider]; }
    get version() { return this.provider.getVersion(); }
}
