import '../static/css/commen.css'
import {Compiler} from './compiler/compiler'
import {obserser} from './observer/observer'
import {Vue} from './vue/vue'

const vm = new Vue({
    el: 'app',
    data: {
        text: 'vue文本',
        value: '29'
    }
});

document.getElementById('data-changer').onclick = (e) => {
    vm.data.text = vm.data.text + 'vue文本';
};

function domDFS (node) {
    const res = [],
    stack = [];
    let currentNode = null;
    stack.push(node);
    while (stack.length) {
        currentNode = stack.pop();
        res.push(currentNode);

        const children = currentNode.children;
        for (let i = children.length; i >=0 ; i--) {
            const child = children[i];
            if (child) {
                stack.push(child);
            }
        }
    }
    return res;
}

console.log(domDFS(document.getElementsByTagName('body')[0]));

