import '../static/css/commen.css'
import {b} from './watcher/watcher'
import {Compiler} from './compiler/compiler'
import {Vue} from './vue/vue'

let a = [1, 2, 3]
console.log([...a], b)

const vm = new Vue({
    el: 'app',
    data: {
        text: 'vue文本',
        value: '29'
    }
})

const compiler = new Compiler(document.getElementById(vm.el), vm)
//添加到原有容器节点
document.getElementById(vm.el).appendChild(compiler.toFragment())
