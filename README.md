# vue-bind
vue双向绑定原理及实现

vue的双向绑定基于数据劫持和发布-订阅模式实现的，主要流程如下：
1. 定义Vue对象，在对象中完成data部分的观察者模式转化，然后执行模板的编译，将data中的数据映射到html模板中具有相同名称的地方，并生成dataKey-node(vm.data中的键名-和该键绑定的dom节点)模式的订阅者，使dataKey与使用到该dataKey的dom节点关联在一起，完成首次渲染；
2. 当在可输入类型的html元素(input、textarea等)上执行输入操作时，通过触发元素的change或keyup事件，改变Vue实例的data中与v-model属性值相同的键所对应的值，完成view层改变自动触发model层相应数据的改变；
3. 当改变vm.data中的数据值时，会触发该值对应的setter，setter会触发发布者，使其发送notify更新通知，告诉每个dataKey对应的发布者可以对它包含的订阅者们执行更新操作了，从而在vm.data中数据变化时改变view层对应dom节点的内容。

下面讲一下具体的实现过程：

