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

