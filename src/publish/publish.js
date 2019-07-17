//定义一个订阅者容器
function Dep () {
    this.subs = [];
}

//新增订阅者
Dep.prototype.push = function (sub) {
    this.subs.push(sub);
}

//通知所有订阅者执行更新
Dep.prototype.notify = function () {
    this.subs.forEach((sub, index) => {
        //每一个订阅者执行更新操作
        sub.update();
    })
}