import { WebSocket } from 'ws';
import { EventEmitter } from 'node:events'; // 引入事件触发器

export class WsClient extends EventEmitter {
    constructor(url) {
        super(); // 调用父类构造函数
        this.url = url;
        this.ws = null;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            //console.log("已成功连接到服务端");
            this.emit('open'); // 转发 open 事件
        });

        this.ws.on('message', (data) => {
            this.emit('message', data); // 转发 message 事件
        });

        this.ws.on('error', (err) => {
            console.error("连接异常，正在重新连接", err.message);
            this.scheduleReconnect();
        });

        this.ws.on('close', () => {
            this.scheduleReconnect();
        });
    }

    scheduleReconnect() {
        // 延迟 5 秒后重连，防止高频报错占满资源
        setTimeout(() => this.connect(), 5000);
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const json = JSON.stringify(data)

            this.ws.send(json);
        } else {
            console.warn("连接未就绪，消息丢弃或入队");
        }
    }
}