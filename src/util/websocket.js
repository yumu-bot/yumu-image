import {EventEmitter} from 'node:events';
import {loggerTime} from "./util.js";

export class WsClient extends EventEmitter {
    constructor(url) {
        super();
        this.url = url;
        this.ws = null;
        this.reconnectTimer = null;
        this.isReconnecting = false;
        this.loggedKeys = new Set();
        this.connect();
    }

    logOnce(key, type, message) {
        if (!this.loggedKeys.has(key)) {
            console[type](loggerTime(message));
            this.loggedKeys.add(key);
        }
    }

    connect() {
        this.cleanup();
        this.isReconnecting = false;

        this.logOnce(`connecting-${this.url}`, 'log', `[WS] 尝试连接: ${this.url}`);

        // 原生 WebSocket:无 maxPayload 选项
        this.ws = new WebSocket(this.url);

        const handshakeTimeout = setTimeout(() => {
            if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
                this.logOnce('terminate', 'warn', '[WS] 握手超时，强制关闭');
                this.ws.close(); // 原 terminate()
            }
        }, 10000);

        this.ws.onopen = () => {
            clearTimeout(handshakeTimeout);
            console.log(loggerTime("[WS] 连接成功"));
            this.loggedKeys.clear();
            this.emit('open');
        };

        this.ws.onmessage = (event) => {
            this.emit('message', event.data);
        };

        this.ws.onerror = (event) => {
            const error_msg = event?.message || (event?.error ? String(event.error) : '');
            if (error_msg.trim().length > 0) {
                this.logOnce(`error-${error_msg}`, 'error', `[WS] 连接报错: ${error_msg}`);
            }
        };

        this.ws.onclose = (event) => {
            this.logOnce(`close-${event.code}`, 'warn', `[WS] 连接关闭 (${event.code}): ${event.reason ?? '无原因'}`);
            this.scheduleReconnect();
        };
    }

    scheduleReconnect() {
        if (this.isReconnecting) return;
        this.isReconnecting = true;

        this.cleanup();

        this.logOnce('schedule', 'log', "[WS] 5 秒后尝试重连...(正在后台静默等待重连...)");

        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, 5000);
    }

    cleanup() {
        if (this.ws) {
            const ws = this.ws;
            this.ws = null;        // 先置空,避免 close 事件再触发 scheduleReconnect
            ws.onopen = null;
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null;     // 等价于原 removeAllListeners()
            try { ws.close(); } catch (e) {}
        }
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            if (this.ws.bufferedAmount > 20 * 1024 * 1024) {
                console.error(loggerTime(`[WS] 发送缓冲区过载，主动断开防止 OOM。当前缓存区：${(this.ws.bufferedAmount / 1024 / 1024).toFixed(2)} MB`));
                this.cleanup();
                return;
            }
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    }
}
