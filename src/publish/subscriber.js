import { Dep } from "./publish";

//定义订阅者
function Subscriber (dataKey, node, vm) {
    //定义Subscriber实例时添加到全局Dep
    Dep.target = this;
    this.dataKey = dataKey;
    this.node = node;
    this.vm = vm;
    //首次模板编译时执行数据更新
    this.update();
    //update()中get data值会触发dataKey所对应的getter，getter中将当前订阅者入栈后，需要将全局target置空
    Dep.target = null;
}

//订阅者的更新函数
Subscriber.prototype.update = function () {
    this.node.nodeValue = this.getValue();
}

//从vm中取最新的数据值
Subscriber.prototype.getValue = function () {
    return this.vm.data[this.dataKey];
}

export {Subscriber}

