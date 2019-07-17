import '../static/css/commen.css'
import {Compiler} from './compiler/compiler'
import {watcher} from './watcher/watcher'
import {Vue} from './vue/vue'

console.log(a)
var a = 123

const vm = new Vue({
    el: 'app',
    data: {
        text: 'vue文本',
        value: '29'
    }
})

console.log(vm.data)

