import '../static/css/commen.css'
import {Compiler} from './compiler/compiler'
import {obserser} from './observer/observer'
import {Vue} from './vue/vue'

function c (a) {
    console.log(a)
    function a () {

    }
    a = 3
    console.log(a)
}
c(2)

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

console.log(vm.data)

