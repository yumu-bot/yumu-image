import { EventEmitter } from 'node:events';
import { loggerTime } from "./util.js";

export class WsClient extends EventEmitter {
    constructor(url, options = {}) {
        super();
        this.url = url;
        this.reconnectInterval = options.reconnectInterval ?? 5000;
        this.handshakeTimeoutMs = options.handshakeTimeoutMs ?? 10000;
        this.maxBufferSize = options.maxBufferSize ?? 20 * 1024 * 1024; // 20MB

        this.ws = null;
        this.reconnectTimer = null;
        this.handshakeTimer = null;
        this.isClosedManually = false;
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
        if (this.isClosedManually) return;

        this.clearPendingTimers();

        this.logOnce(`connecting-${this.url}`, 'log', `[WS] 尝试连接: ${this.url}`);

        // Bun 原生支持 Standard Web WebSocket API
        this.ws = new WebSocket(this.url);

        // 设置握手超时控制
        this.handshakeTimer = setTimeout(() => {
            if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
                this.logOnce('handshake-timeout', 'warn', '[WS] 握手超时，强制关闭');
                this.ws.close();
            }
        }, this.handshakeTimeoutMs);

        this.ws.onopen = () => {
            clearTimeout(this.handshakeTimer);
            console.log(loggerTime("[WS] 连接成功"));
            this.loggedKeys.clear(); // 连接成功后复位日志状态
            this.emit('open');
        };

        this.ws.onmessage = (event) => {
            this.emit('message', event.data);
        };

        this.ws.onerror = (event) => {
            const errorMsg = event?.message || (event?.error ? String(event.error) : '未知错误');
            this.logOnce(`error-${errorMsg}`, 'error', `[WS] 连接报错: ${errorMsg}`);
        };

        this.ws.onclose = (event) => {
            clearTimeout(this.handshakeTimer);
            this.ws = null;

            if (this.isClosedManually) return;

            this.logOnce(`close-${event.code}`, 'warn', `[WS] 连接关闭 (${event.code}): ${event.reason || '无原因'}`);
            this.scheduleReconnect();
        };
    }

    scheduleReconnect() {
        if (this.isClosedManually || this.reconnectTimer) return;

        this.logOnce('schedule', 'log', `[WS] ${this.reconnectInterval / 1000} 秒后尝试重连...`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectInterval);
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            // Bun 完美支持 bufferedAmount
            if (this.ws.bufferedAmount > this.maxBufferSize) {
                console.error(
                    loggerTime(`[WS] 发送缓冲区过载 (${(this.ws.bufferedAmount / 1024 / 1024).toFixed(2)} MB)，主动断开重连。`)
                );
                // 关闭连接，利用 onclose 自动触发 scheduleReconnect
                this.ws.close();
                return;
            }

            const payload = typeof data === 'string' || data instanceof Uint8Array
                ? data
                : JSON.stringify(data);

            this.ws.send(payload);
        }
    }

    clearPendingTimers() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.handshakeTimer) {
            clearTimeout(this.handshakeTimer);
            this.handshakeTimer = null;
        }
    }

    /**
     * 手动彻底关闭客户端（不再重连）
     */
    close() {
        this.isClosedManually = true;
        this.clearPendingTimers();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.removeAllListeners();
    }
}