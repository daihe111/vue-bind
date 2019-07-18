import {Dep} from '../publish/publish'

//观察者
function obserser (obj) {
    for (let key in obj) {
        const currentItem = obj[key];
        if (typeof currentItem === 'object') {
            obserser(currentItem);
        }
        //为当前dataKey定义一个全局订阅者容器
        const dep = new Dep();
        let value = currentItem;
        Object.defineProperty(obj, key, {
            get: function () {
                //把订阅者添加到当前容器数组中
                if (Dep.target) {
                    dep.push(Dep.target);
                }
                return value;
            },
            set: function (val) {
                if (val === value) {
                    return;
                }
                value = val;
                //赋值时触发相应的动作
                dep.notify();
            }
        })
    }
}

export {
    obserser
}