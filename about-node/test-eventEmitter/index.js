const EventEmitter = require('events').EventEmitter;

class MyEventEmitter extends EventEmitter {
    constructor() {
        super();
        console.log('实例化了')

        setTimeout(() => {
            this.emit('priceChange', 80)
        }, 4000)
    }
}

const myEE = new MyEventEmitter()

myEE.addListener('priceChange', data => {
    console.log('接收到了priceChange事件', data)
})
