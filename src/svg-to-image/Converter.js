import * as cheerio from 'cheerio';

import fileUrl from 'file-url';
import path from "path";
import puppeteer from "puppeteer";
import tmp from "tmp";
import {readFile, writeFile} from 'fs/promises';

const _allowedAttributeNames = Symbol('allowedAttributeNames');
const _allowedDeprecatedAttributeNames = Symbol('allowedDeprecatedAttributeNames');
const _browserPromise = Symbol('browserPromise');
const _browser = Symbol('browser');
const _context = Symbol('context');
const _convert = Symbol('convert');
const _destroyed = Symbol('destroyed');
const _getDimensions = Symbol('getDimensions');
const _getPage = Symbol('getPage');
const _getTempFile = Symbol('getTempFile');
const _isAttributeAllowed = Symbol('isAttributeAllowed');
const _options = Symbol('options');
const _page = Symbol('page');
const _parseOptions = Symbol('parseOptions');
const _provider = Symbol('provider');
const _roundDimension = Symbol('roundDimension');
const _roundDimensions = Symbol('roundDimensions');
const _sanitize = Symbol('sanitize');
const _setDimensions = Symbol('setDimensions');
const _tempFile = Symbol('tempFile');
const _validate = Symbol('validate');

/**
 * Converts SVG to another format using a headless Chromium instance.
 *
 * It is important to note that, after the first time either {@link Converter#convert} or{@link Converter#convertFile}
 * are called, a headless Chromium instance will remain open until {@link Converter#destroy} is called. This is done
 * automatically when using the {@link API} convert methods, however, when using {@link Converter} directly, it is the
 * responsibility of the caller. Due to the fact that creating browser instances is expensive, this level of control
 * allows callers to reuse a browser for multiple conversions. For example; one could create a {@link Converter} and use
 * it to convert a collection of SVG files to files in another format and then destroy it afterwards. It's not
 * recommended to keep an instance around for too long, as it will use up resources.
 *
 * Due to constraints within Chromium, the SVG input is first written to a temporary HTML file and then navigated to.
 * This is because the default page for Chromium is using the <code>chrome</code> protocol so cannot load externally
 * referenced files (e.g. that use the <code>file</code> protocol). This temporary file is reused for the lifespan of
 * each {@link Converter} instance and will be deleted when it is destroyed.
 *
 * It's also the responsibility of the caller to ensure that all {@link Converter} instances are destroyed before the
 * process exits. This is why a short-lived {@link Converter} instance combined with a try/finally block is ideal.
 *
 * @public
 */
export default class Converter {

    /**
     * Creates an instance of {@link Converter} using the specified <code>provider</code> and the <code>options</code>
     * provided.
     *
     * @param {Provider} provider - the {@link Provider} to be used
     * @param {Converter~Options} [options] - the options to be used
     * @public
     */
    constructor(provider, options) {
        this[_provider] = provider;
        this[_options] = Object.assign({}, options);
        this[_allowedAttributeNames] = new Set([
            // Core
            'height',
            'preserveAspectRatio',
            'viewBox',
            'width',
            'x',
            'xmlns',
            'y',
            // Conditional Processing
            'requiredExtensions',
            'systemLanguage',
            // Presentation
            'clip-path',
            'clip-rule',
            'color',
            'color-interpolation',
            'cursor',
            'display',
            'fill',
            'fill-opacity',
            'fill-rule',
            'filter',
            'mask',
            'opacity',
            'overflow',
            'pointer-events',
            'shape-rendering',
            'stroke',
            'stroke-dasharray',
            'stroke-dashoffset',
            'stroke-linecap',
            'stroke-linejoin',
            'stroke-miterlimit',
            'stroke-opacity',
            'stroke-width',
            'style',
            'transform',
            'vector-effect',
            'visibility',
            // XML
            'xml:lang',
            'xmlns',
            'xmlns:xlink'
        ]);
        this[_allowedDeprecatedAttributeNames] = new Set([
            // Core
            'baseProfile',
            'version',
            'zoomAndPan',
            // Conditional Processing
            'requiredFeatures',
            // Presentation
            'clip',
            'color-rendering',
            'enable-background',
            // XML
            'xml:base',
            'xml:space'
        ]);
        this[_destroyed] = false;
    }

    /**
     * Converts the specified <code>input</code> SVG into another format using the <code>options</code> provided.
     *
     * <code>input</code> can either be an SVG buffer or string.
     *
     * If the width and/or height cannot be derived from <code>input</code> then they must be provided via their
     * corresponding options. This method attempts to derive the dimensions from <code>input</code> via any
     * <code>width</code>/<code>height</code> attributes or its calculated <code>viewBox</code> attribute.
     *
     * Only standard SVG element attributes (excl. event attributes) are allowed and others are stripped from the SVG
     * before being converted. This includes deprecated attributes unless the <code>allowDeprecatedAttributes</code>
     * option is disabled. This is primarily for security purposes to ensure that malicious code cannot be injected.
     *
     * This method is resolved with the converted output buffer.
     *
     * An error will occur if this {@link Converter} has been destroyed, both the <code>baseFile</code> and
     * <code>baseUrl</code> options have been provided, <code>input</code> does not contain an SVG element, or no
     * <code>width</code> and/or <code>height</code> options were provided and this information could not be derived from
     * <code>input</code>.
     *
     * @param {Buffer|string} input - the SVG input to be converted to another format
     * @param {Converter~ConvertOptions} [options] - the options to be used
     * @return {Promise<Buffer>} A <code>Promise</code> that is resolved with the converted output buffer.
     * @public
     */
    async convert(input, options) {
        this[_validate]();

        options = this[_parseOptions](options);

        return await this[_convert](input, options);
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
     * Only standard SVG element attributes (excl. event attributes) are allowed and others are stripped from the SVG
     * before being converted. This includes deprecated attributes unless the <code>allowDeprecatedAttributes</code>
     * option is disabled. This is primarily for security purposes to ensure that malicious code cannot be injected.
     *
     * This method is resolved with the path of the converted output file for reference.
     *
     * An error will occur if this {@link Converter} has been destroyed, both the <code>baseFile</code> and
     * <code>baseUrl</code> options have been provided, the input file does not contain an SVG element, no
     * <code>width</code> and/or <code>height</code> options were provided and this information could not be derived from
     * input file, or a problem arises while reading the input file or writing the output file.
     *
     * @param {string} inputFilePath - the path of the SVG file to be converted to another file format
     * @param {Converter~ConvertFileOptions} [options] - the options to be used
     * @return {Promise<string>} A <code>Promise</code> that is resolved with the output file path.
     * @public
     */
    async convertFile(inputFilePath, options) {
        this[_validate]();

        options = this[_parseOptions](options, inputFilePath);

        const input = await readFile(inputFilePath);
        const output = await this[_convert](input, options);

        await writeFile(options.outputFilePath, output);

        return options.outputFilePath;
    }

    /**
     * Destroys this {@link Converter}.
     *
     * This will close any headless Chromium browser that has been opend by this {@link Converter} as well as deleting any
     * temporary file that it may have created.
     *
     * Once destroyed, this {@link Converter} should be discarded and a new one created, if needed.
     *
     * An error will occur if any problem arises while closing the browser, where applicable.
     *
     * @return {Promise<void>} A <code>Promise</code> that is resolved once this {@link Converter} has been
     * destroyed.
     * @public
     */
    async destroy() {
        if (this[_destroyed]) {
            return;
        }

        this[_destroyed] = true;

        // 清理临时文件
        if (this[_tempFile]) {
            try {
                this[_tempFile].cleanup();
            } catch (e) {
                console.error('[Destroy] 清理临时文件失败:', e.message);
            }
            delete this[_tempFile];
        }

        if (this[_page]) {
            try {
                await this[_page].close();
            } catch (e) {
                console.warn('[Destroy] 关闭页面失败或页面已关闭:', e.message);
            }
            delete this[_page];
        }

        if (this[_context]) {
            try {
                await this[_context].close();
            } catch (e) {
                console.warn('[Destroy] 关闭上下文失败:', e.message);
            }
            delete this[_context];
        }

        if (this[_browser]) {
            try {
                await this[_browser].close();
                console.log('[Destroy] Chromium 浏览器已成功关闭');
            } catch (e) {
                console.error('[Destroy] 强关浏览器失败! 可能会产生僵尸进程:', e.message);
            }
            delete this[_browser];
        }

        if (this[_browserPromise]) {
            try {
                await this[_browserPromise].close();
                console.log('[Destroy] Chromium 浏览器实例已成功关闭');
            } catch (e) {
                console.error('[Destroy] 强关浏览器实例失败! 可能会产生僵尸进程:', e.message);
            }
            delete this[_browserPromise];
        }
    }

    async close() {
        if (this[_page]) {
            await this[_page].close().catch(() => {});
            delete this[_page];
        }

        if (this[_context]) {
            await this[_context].close().catch(() => {});
            delete this[_context];
        }

        if (this[_tempFile]) {
            this[_tempFile].cleanup();
            delete this[_tempFile];
        }
    }

    async [_convert](input, options) {
        input = Buffer.isBuffer(input) ? input.toString('utf8') : input;

        const { provider } = this;
        // const svg = cheerio.default.html(this[_sanitize](cheerio.load(input, null, false)('svg:first'), options));

        // 1. 加载代码，生成实例 $
        const $ = cheerio.load(input, { xml: false }, false);

        // 2. 选取并清洗节点 (注意：'svg:first' 建议换成 $('svg').first())
        const sanitizedNode = this[_sanitize]($('svg').first(), options);

        // 3. 将清洗后的节点转回字符串
        const svg = $.html(sanitizedNode);

        if (!svg) {
            throw new Error('SVG element not found in input. Check the SVG input');
        }

        const html = `<!DOCTYPE html>
<html lang="">
<head>
<base href="${options.baseUrl}">
<meta charset="utf-8">
<style>
* { margin: 0; padding: 0; }
html { background-color: ${provider.getBackgroundColor(options)}; }
</style>
</head>
<body>${svg}</body>
</html>`;

        const { page, context, cleanup } = await this[_getPage](html);

        try {
            await this[_setDimensions](page, options);
            const dimensions = await this[_getDimensions](page, options);

            if (options.scale > 0 && options.scale !== 1 ) {
                dimensions.height *= options.scale;
                dimensions.width *= options.scale;
                await this[_setDimensions](page, dimensions);
            }

            await page.setViewport(dimensions);

            return await page.screenshot(Object.assign({
                type: provider.getType(),
                clip: Object.assign({x: 0, y: 0}, dimensions)
            }, provider.getScreenshotOptions(options)));
        } finally {
            if (cleanup) {
                try { cleanup(); } catch (e) { console.error("临时文件删除失败:", e); }
            }

            if (context) {
                await context.close().catch(() => {});
            }
        }
    }

    async [_getDimensions](page, options) {
        const dimensions = await page.evaluate(() => {
            const el = document.querySelector('svg');
            if (!el) {
                return null;
            }

            function parseAttributeDimension(attributeName) {
                const attributeValue = el.getAttribute(attributeName);
                if (!attributeValue || attributeValue.endsWith('%')) {
                    return null;
                }

                const dimension = parseFloat(attributeValue);
                if (Number.isNaN(dimension)) {
                    return null;
                }

                if (attributeValue.endsWith('pt')) {
                    return dimension * 1.33333;
                }

                return dimension;
            }

            const width = parseAttributeDimension('width');
            const height = parseAttributeDimension('height');

            if (width && height) {
                return { width, height };
            }

            const viewBoxWidth = el.viewBox.animVal.width;
            const viewBoxHeight = el.viewBox.animVal.height;

            if (width && viewBoxHeight) {
                return {
                    width,
                    height: width * viewBoxHeight / viewBoxWidth
                };
            }

            if (height && viewBoxWidth) {
                return {
                    width: height * viewBoxWidth / viewBoxHeight,
                    height
                };
            }

            return null;
        });
        if (!dimensions) {
            throw new Error('Unable to derive width and height from SVG. Consider specifying corresponding options');
        }

        return this[_roundDimensions](dimensions, options.rounding);
    }

    async [_getPage](html) {
        if (!this[_browser]) {
            if (!this[_browserPromise]) {
                this[_browserPromise] = puppeteer.launch(this[_options].puppeteer).then(b => {
                    this[_browser] = b;
                    return b;
                });
            }
            await this[_browserPromise];
        }

        const context = await this[_browser].createBrowserContext();
        const page = await context.newPage();

        let tempFile

        try {
            tempFile = await this[_getTempFile]();
            await writeFile(tempFile.path, html);
            await page.goto(fileUrl(tempFile.path));

            return { page, context, cleanup: tempFile.cleanup }
        } catch (error) {
            if (tempFile && tempFile.cleanup) tempFile.cleanup();
            await context.close();
            throw error;
        }
    }

    /**
     * @return {Promise<File>}
     */
    [_getTempFile]() {
        return new Promise((resolve, reject) => {
            tmp.file({ prefix: 'convert-svg-', postfix: '.html' }, (error, filePath, fd, cleanup) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ path: filePath, cleanup });
                }
            });
        });
    }

    [_isAttributeAllowed](attributeName, options) {
        return this[_allowedAttributeNames].has(attributeName) ||
            (options.allowDeprecatedAttributes && this[_allowedDeprecatedAttributeNames].has(attributeName));
    }

    [_parseOptions](options, inputFilePath) {
        options = Object.assign({}, options);

        const { provider } = this;

        if (!options.outputFilePath && inputFilePath) {
            const extension = `.${provider.getExtension()}`;
            const outputDirPath = path.dirname(inputFilePath);
            const outputFileName = `${path.basename(inputFilePath, path.extname(inputFilePath))}${extension}`;

            options.outputFilePath = path.join(outputDirPath, outputFileName);
        }

        if (typeof options.allowDeprecatedAttributes !== 'boolean') {
            options.allowDeprecatedAttributes = true;
        }

        if (options.baseFile != null && options.baseUrl != null) {
            throw new Error('Both baseFile and baseUrl options specified. Use only one');
        }
        if (typeof options.baseFile === 'string') {
            options.baseUrl = fileUrl(options.baseFile);
            delete options.baseFile;
        }
        if (!options.baseUrl) {
            options.baseUrl = fileUrl(inputFilePath ? path.resolve(inputFilePath) : process.cwd());
        }

        if (typeof options.height === 'string') {
            options.height = parseInt(options.height, 10);
        }

        if (typeof options.rounding !== 'string' || !['ceil', 'floor', 'round'].includes(options.rounding)) {
            options.rounding = 'round';
        }

        if (options.scale == null) {
            options.scale = 1;
        }

        if (typeof options.width === 'string') {
            options.width = parseInt(options.width, 10);
        }

        provider.parseAPIOptions(options, inputFilePath);

        return options;
    }

    [_roundDimension](dimension, rounding) {
        switch (rounding) {
            case 'ceil':
                return Math.ceil(dimension);
            case 'floor':
                return Math.floor(dimension);
            case 'round':
            default:
                return Math.round(dimension);
        }
    }

    [_roundDimensions](dimensions, rounding) {
        return {
            width: this[_roundDimension](dimensions.width, rounding),
            height: this[_roundDimension](dimensions.height, rounding),
        };
    }

    [_sanitize](svg, options) {
        const attributeNames = Object.keys(svg.attr() || {});

        for (const attributeName of attributeNames) {
            if (!this[_isAttributeAllowed](attributeName, options)) {
                svg.removeAttr(attributeName);
            }
        }

        return svg;
    }

    async [_setDimensions](page, dimensions) {
        if (typeof dimensions.width !== 'number' && typeof dimensions.height !== 'number') {
            return;
        }

        await page.evaluate(({ width, height }) => {
            const el = document.querySelector('svg');
            if (!el) {
                return;
            }

            if (typeof width === 'number') {
                el.setAttribute('width', `${width}px`);
            } else {
                el.removeAttribute('width');
            }

            if (typeof height === 'number') {
                el.setAttribute('height', `${height}px`);
            } else {
                el.removeAttribute('height');
            }
        }, dimensions);
    }

    [_validate]() {
        if (this[_destroyed]) {
            throw new Error('Converter has been destroyed. A new Converter must be created');
        }
    }

    /**
     * Returns whether this {@link Converter} has been destroyed.
     *
     * @return {boolean} <code>true</code> if destroyed; otherwise <code>false</code>.
     * @see {@link Converter#destroy}
     * @public
     */
    get destroyed() {
        return this[_destroyed];
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

}

/**
 * The options that can be passed to {@link Converter#convertFile}.
 *
 * @typedef {Converter~ConvertOptions} Converter~ConvertFileOptions
 * @property {string} [outputFilePath] - The path of the file to which the output should be written to. By default, this
 * will be derived from the input file path.
 */

/**
 * The options that can be passed to {@link Converter#convert}.
 *
 * @typedef {Object} Converter~ConvertOptions
 * @property {boolean} [allowDeprecatedAttributes=true] - Whether deprecated SVG element attributes should be retained
 * in the SVG during conversion.
 * @property {string} [background] - The background color to be used to fill transparent regions within the SVG. If
 * omitted, the {@link Provider} will determine the default background color.
 * @property {string} [baseFile] - The path of the file to be converted into a file URL to use for all relative URLs
 * contained within the SVG. Cannot be used in conjunction with the <code>baseUrl</code> option.
 * @property {string} [baseUrl] - The base URL to use for all relative URLs contained within the SVG. Cannot be used in
 * conjunction with the <code>baseFile</code> option.
 * @property {number|string} [height] - The height of the output to be generated. If omitted, an attempt will be made to
 * derive the height from the SVG input.
 * @property {Converter~Rounding} [rounding] - The type of rounding to be applied to the width and height. If omitted,
 * the dimensions with be rounded to the nearest integer.
 * @property {number} [scale=1] - The scale to be applied to the width and height (either specified as options or
 * derived).
 * @property {number|string} [width] - The width of the output to be generated. If omitted, an attempt will be made to
 * derive the width from the SVG input.
 */

/**
 * The options that can be passed to {@link Converter}.
 *
 * @typedef {Object} Converter~Options
 * @property {Object} [puppeteer] - The options that are to be passed directly to <code>puppeteer.launch</code> when
 * creating the <code>Browser</code> instance.
 */

/**
 * The type of rounding to be applied to the width and height during a conversion.
 *
 * @typedef {'ceil'|'floor'|'round'} Converter~Rounding
 */