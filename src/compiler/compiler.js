function Compiler (node, vm) {
    this.node = node
    this.vm = vm

}
Compiler.prototype.toFragment = function () {
    const fragment = document.createDocumentFragment()
    while (this.node.firstChild) {
        this.mapTo(this.node.firstChild);
        fragment.appendChild(this.node.firstChild);
    }
    return fragment;
}
Compiler.prototype.mapTo = function (node) {
    const currentChild = node;
    //节点类型为dom
    if (currentChild.nodeType === 1) {
        const attributes = currentChild.attributes;
        let dataKey;
        for (let j = 0; j < attributes.length; j++) {
            if (attributes[j].nodeName === 'v-model') {
                dataKey = attributes[j].nodeValue
                currentChild.value = this.vm.data[dataKey]
                currentChild.removeAttribute('v-model')
            }
        }
        currentChild.addEventListener('keyup', (e) => {
            this.vm.data[dataKey] = e.target.value;
            console.log(this.vm.data);
        });
    }
    //节点类型为文本节点
    if (currentChild.nodeType === 3) {
        const reg = /\{\{(.*)\}\}/g
        const text = currentChild.nodeValue
        if (reg.test(text)) {
            const dataKey = RegExp.$1.trim();
            currentChild.nodeValue = this.vm.data[dataKey];
        }
    }
}

export {Compiler}