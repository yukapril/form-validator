# FormValidator

## 用法

代码示例：

```html
<form id="J_Form">
    <input type="text" name="username" value=""><br/>
    <input type="text" id="J_Age"><br/>
    <input type="password" name="pw"><br/>
    <textarea name="desc"></textarea><br/>
</form>

<script>
// 自定义规则
var rules = [
    {
      name: 'username', // 验证规则名字
      isRequired: true, // 是否必须输入
      minLength: 2,		// 最小长度
      maxLength: 10,	// 最大长度
      rep: /[a-z]+/,	// 正则验证
      fn: v => v !== 'abc'	// 自定义函数
    }
]

// 默认添加表单带有 name 属性的元素
// 可识别的元素有 input[text,password,tel,number] / textarea
// 添加的元素，默认验证规则名字与元素 name 相同
var form = new FormValidator('#J_Form', rules) 

// 如果表单元素没有 name，或者需要覆盖规则，可以使用自定义添加
form.addElement('#J_Age', 'age')

// 表单事件监听
form.on('username', (validator)=>{
  console.log(validator, e)
  // validator:
  // {
  //   $modify:true
  //   $valid:false
  //   fn:true
  //   isRequired:true
  //   maxLength:true
  //   minLength:false
  //   name:"username"
  //   rep:true
  // }
  
  // 只有当用户主动修改修改表单内容，才可获得对象 e
  // 当通过 Form.prototype.setValue 等修改内容，并触发监听，此时无 e
})
</script>
```


## html 支持属性

不支持 HTML5 原生表单验证方法（`required` 等）。

## API

#### 初始化：

* 参数 `(element, rules)`

* `element` 为表单元素，支持字符串和表单元素

* `rules` 为规则集，类型为数组。规则如下：
   * `name` 验证规则名字
   * `isRequired` 是否必须输入
   * `minLength` 最小长度
   * `maxLength` 最大长度
   * `rep` 正则验证
   * `fn` 自定义验证（必须是同步函数，返回验证结果 `Boolean`）


#### 属性：

* `validator` 表单验证结果，返回验证结果对象，`key` 为表单验证规则名字，`value` 内容如下：
  * `name` 验证规则名字
  * `isRequired` 必须输入验证是否通过
  * `minLength` 最小长度验证是否通过
  * `maxLength` 最大长度验证是否通过
  * `rep` 正则验证是否通过
  * `fn` 自定义验证是否通过
  * `$modify` 是否修改过
  * `$valid` 是否通过以上验证

#### 方法：

* `FormValidator.prototype.addElement`

  参数 `(element [,name])`

  增加表单元素，除默认传入表单外，还可以通过此添加表单元素

* `FormValidator.prototype.on`

  参数 `([name,] handler [,isLazy])`

  表单元素改变监听。

  `name` 为表单元素验证规则；

  `handler` 为触发回调函数，可以接收参数 `validator` 和事件 `Event`；

  `isLazy` 为懒模式选项，`true` 表示只有当表单元素失去焦点（`blur`）才进行触发回调 

* `FormValidator.prototype.interceptor`

  参数 `([name,] handler)`

  对表单元素输入进行拦截，目前只支持用户按键输入拦截，**不支持拦截粘贴操作**

  `handler` 接收按键事件(`keypress`)，返回是否进行拦截 ` Boolean`；可通过 `Event.which` 来进行判断是否需要进行拦截

* `FormValidator.prototype.forceValidate`

  参数 `无`

  强制触发验证机制。在实例化后，添加 `FormValidator.prototype.on` 方法，但用户不进行手动输入，此时不会触发 `on` 方法，可以通过此方法强制触发一次验证

  **本方法仅触发非懒监听（`isLazy`）的 `on` 方法函数**

* `FormValidator.prototype.getValue`

  参数 `(name)`

  获取表单元素值。如果 `name` 不存在，则返回所有元素的值集合（对象）

* `FormValidator.prototype.setValue`

  参数 `(name, val)`

  给表单元素赋值，通过此方法给表单赋值，会触发已经定义的 `FormValidator.prototype.on` 事件

  如果不希望触发，可直接通过 DOM 操作表单元素赋值


