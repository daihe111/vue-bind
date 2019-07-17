function watcher (obj) {
    for (let key in obj) {
        const currentItem = obj[key];
        if (typeof currentItem === 'object') {
            watcher(currentItem);
        }
        let value = currentItem;
        Object.defineProperty(obj, key, {
            get: function () {
                return value;
            },
            set: function (val) {
                if (val === value) {
                    return;
                }
                value = val;
                //赋值时触发相应的动作
                
            }
        })
    }
}

export {
    watcher
}