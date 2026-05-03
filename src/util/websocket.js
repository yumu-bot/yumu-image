import { WebSocket } from 'ws';
import { EventEmitter } from 'node:events';

export class WsClient extends EventEmitter {
    constructor(url) {
        super();
        this.url = url;
        this.ws = null;
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.isReconnecting = false; // 提升为类属性
        this.connect();
    }

    connect() {
        // 1. 进入连接流程，先彻底清理
        this.cleanup();
        this.isReconnecting = false;

        console.log(`[WS] 尝试连接: ${this.url}`);
        this.ws = new WebSocket(this.url, {
            maxPayload: 20 * 1024 * 1024 // 同样设为 20MB
        });

        // 设置一个握手超时，防止连接挂死在 CONNECTING 状态
        const handshakeTimeout = setTimeout(() => {
            if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
                console.error("[WS] 握手超时，强制关闭");
                this.ws.terminate();
            }
        }, 10000);

        this.ws.on('open', () => {
            clearTimeout(handshakeTimeout);
            console.log("[WS] 连接成功");
            this.startHeartbeat(); // 开启心跳
            this.emit('open');
        });

        this.ws.on('message', (data) => {
            this.emit('message', data);
        });

        this.ws.on('error', (err) => {
            console.error("[WS] 连接报错:", err.message);
            // 报错后通常会触发 close，统一在 close 处理重连
        });

        this.ws.on('close', (code, reason) => {
            console.warn(`[WS] 连接关闭 (${code}): ${reason || '无原因'}`);
            this.scheduleReconnect();
        });

        // 响应服务端发送的 ping
        this.ws.on('ping', () => this.ws?.pong());
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // 主动发送 ping，如果链路断了，底层会抛出错误
                this.ws.ping();
            }
        }, 30000);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    scheduleReconnect() {
        if (this.isReconnecting) return;
        this.isReconnecting = true;

        this.stopHeartbeat();
        this.cleanup();

        console.log("[WS] 5秒后尝试重连...");
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, 5000);
    }

    cleanup() {
        if (this.ws) {
            // 必须先移除所有监听器，否则 terminate 触发的 close 又会调 scheduleReconnect
            this.ws.removeAllListeners();
            this.ws.terminate();
            this.ws = null;
        }
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {

            if (this.ws.bufferedAmount > 20 * 1024 * 1024) {
                console.error("[WS] 发送缓冲区过载，主动断开防止 OOM");
                this.ws.terminate();
                return;
            }
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    }
}