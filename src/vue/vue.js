import {Compiler} from '../compiler/compiler'
import {watcher} from '../watcher/watcher'

function Vue (options) {
    this.data = options.data;
    this.el = options.el;


    //将data转化为观察者模式
    watcher(this.data);
    
    //编译
    const dom = document.getElementById(this.el);
    const compiler = new Compiler(dom, this);
    const fragment = compiler.toFragment();
    dom.appendChild(fragment);
}

export {Vue}