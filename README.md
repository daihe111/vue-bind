
# vue双向绑定原理解析

## vue双向绑定原理技术要点

- 数据劫持
- 发布者-订阅者模式

## vue双向绑定主要步骤
1. 定义**Vue对象**，在对象中完成data部分的观察者模式转化，然后执行模板的编译，将data中的数据映射到html模板中具有相同名称的地方，并生成dataKey-node(vm.data中的键名-和该键绑定的dom节点)模式的订阅者，使dataKey与使用到该dataKey的dom节点关联在一起，完成首次渲染；
2. 当在可输入类型的html元素(input、textarea等)上执行输入操作时，通过触发元素的change或keyup事件，改变Vue实例的data中与v-model属性值相同的键所对应的值，完成view层改变自动触发model层相应数据的改变；
3. 当改变vm.data中的数据值时，会触发该值对应的setter，setter会触发发布者，使其发送notify更新通知，告诉每个dataKey对应的发布者可以对它包含的订阅者们执行更新操作了，从而在vm.data中数据变化时改变view层对应dom节点的内容。

## vue双向绑定具体实现过程

**1.  编译阶段，将vue实例的data部分映射到实际的dom节点上**

```javascript
//定义编译器，用来将data映射到dom节点上
function  Compiler (node, vm) {
	this.node  =  node
	this.vm  =  vm
}

//将编译好的节点劫持到documentFragment对象中，并整体插入原有的dom容器中
Compiler.prototype.toFragment  =  function () {
	const  fragment  =  document.createDocumentFragment()
	while (this.node.firstChild) {
		this.mapTo(this.node.firstChild);
		fragment.appendChild(this.node.firstChild);
	}
	return  fragment;
}

//将data映射到单个节点上
Compiler.prototype.mapTo  =  function (node) {
	const  currentChild  =  node;
	//节点类型为dom
	if (currentChild.nodeType  ===  1) {
		const  attributes  =  currentChild.attributes;
		let  dataKey;
		for (let  j  =  0; j  <  attributes.length; j++) {
			if (attributes[j].nodeName  ===  'v-model') {
				dataKey  =  attributes[j].nodeValue
				currentChild.value  =  this.vm.data[dataKey]
				currentChild.removeAttribute('v-model')
			}
		}
		currentChild.addEventListener('keyup', (e) => {
			this.vm.data[dataKey] =  e.target.value;
			console.log(this.vm.data);
		});
	}
	//节点类型为文本节点
	if (currentChild.nodeType  ===  3) {
		const  reg  = /\{\{(.*)\}\}/g
		const  text  =  currentChild.nodeValue
		if (reg.test(text)) {
			const  dataKey  =  RegExp.$1.trim();
			//currentChild.nodeValue = this.vm.data[dataKey];

			//生成与dataKey相关联的节点的订阅者
			new  Subscriber(dataKey, currentChild, this.vm);
		}
	}
}  
```
代码中的Subscriber对象是用来将data中相应的值和dom节点相关联的订阅者，它负责在发布者发布通知时执行更新，别急，我们在后边的代码中将会定义它！

**2. 定义能将data转化为观察者模式的observer**

```javascript
//定义观察者obserser

function  obserser (obj) {
	for (let  key  in  obj) {
		const  currentItem  =  obj[key];
		if (typeof  currentItem  ===  'object') {
			obserser(currentItem);
		}
		//为当前dataKey定义一个全局订阅者容器
		const  dep  =  new  Dep();
		let  value  =  currentItem;
		Object.defineProperty(obj, key, {
			get:  function () {
				//把订阅者添加到当前容器数组中
				if (Dep.target) {
					dep.push(Dep.target);
				}
				return  value;
			},
			set:  function (val) {
				if (val  ===  value) {
					return;
				}
				value  =  val;
				//赋值时触发相应的动作
				dep.notify();
			}
		})
	}
}
```
observer通过递归的方式，能将传入的对象深度转换为getter/setter模式，这样就能够做到数据劫持。model改变触发view改变的关键之处就在这里，我们可以在set函数中设置一个消息通知器(我们暂时这么称呼它)，当我们改变对象中的值时，会触发它所对应的set函数，同时发布者会发送通知，告诉所有订阅者获取最新的值，从而改变view。

**3.定义订阅者**

```javascript
//定义订阅者
function  Subscriber (dataKey, node, vm) {
	//定义Subscriber实例时添加到全局Dep
	Dep.target  =  this;
	this.dataKey  =  dataKey;
	this.node  =  node;
	this.vm  =  vm;
	//首次模板编译时执行数据更新
	this.update();
	//update()中get data值会触发dataKey所对应的getter，getter中将当前订阅者入栈后，需要将全局target置空
	Dep.target  =  null;
}

//订阅者的更新函数
Subscriber.prototype.update  =  function () {
	this.node.nodeValue  =  this.getValue();
}

//从vm中取最新的数据值
Subscriber.prototype.getValue  =  function () {
	return  this.vm.data[this.dataKey];
}
```
订阅者包含了dataKey、node两个关键属性，dataKey代表data中的键值，node代表和该dataKey关联在一起的dom节点，即dataKey对应的值变化时，会触发node外观的更新，update函数负责执行节点内容的更新操作。
***注意：***  由于定义Subscriber实例时的作用域和发布者不是同一个，因此需要引入一个全局变量最为桥梁，就是我们上面定义的Dep.target，他的作用和java里的stactic类似，这就使我们在定义观察者实例时，将观察者存储到Dep.target中，并在编译阶段触发get函数，将订阅者存到dataKey所对应的发布者容器里。

**4.定义发布者**

```javascript
//定义一个订阅者容器(即发布者)
function  Dep () {
	this.subs  = [];
}
  
//新增订阅者
Dep.prototype.push  =  function (sub) {
	this.subs.push(sub);
}
  
//通知所有订阅者执行更新
Dep.prototype.notify  =  function () {
	this.subs.forEach((sub, index) => {
		//每一个订阅者执行更新操作
		sub.update();
	})
}
```
发布者是一个订阅者容器，它有一个通知函数，当执行该函数时，容器中所有的订阅者都会执行update，触发view的更新。
