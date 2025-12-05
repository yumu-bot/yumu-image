
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function decodeText(ptr, len) {
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const RgbFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rgb_free(ptr >>> 0, 1));

class Rgb {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Rgb.prototype);
        obj.__wbg_ptr = ptr;
        RgbFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RgbFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rgb_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get r() {
        const ret = wasm.__wbg_get_rgb_r(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set r(arg0) {
        wasm.__wbg_set_rgb_r(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get g() {
        const ret = wasm.__wbg_get_rgb_g(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set g(arg0) {
        wasm.__wbg_set_rgb_g(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get b() {
        const ret = wasm.__wbg_get_rgb_b(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set b(arg0) {
        wasm.__wbg_set_rgb_b(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {string}
     */
    to_hex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.rgb_to_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Rgb.prototype[Symbol.dispose] = Rgb.prototype.free;
exports.Rgb = Rgb;

/**
 * @param {Uint8Array} image_data
 * @param {number} count
 * @returns {Rgb[]}
 */
function call_core(image_data, count) {
    const ptr0 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.call_core(ptr0, len0, count);
    var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}
exports.call_core = call_core;

exports.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

exports.__wbg_rgb_new = function(arg0) {
    const ret = Rgb.__wrap(arg0);
    return ret;
};

exports.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
};

const wasmPath = `${__dirname}/wasm_wrapper_bg.wasm`;
const wasmBytes = require('fs').readFileSync(wasmPath);
const wasmModule = new WebAssembly.Module(wasmBytes);
const wasm = exports.__wasm = new WebAssembly.Instance(wasmModule, imports).exports;

wasm.__wbindgen_start();
