//定义订阅者
function Subscriber (dataKey, node, vm) {
    this.dataKey = dataKey;
    this.node = node;
    this.vm = vm;
}

//订阅者的更新函数
Subscriber.prototype.update = function () {
    this.node.nodeValue = this.vm[this.dataKey];
}

export {Subscriber}

