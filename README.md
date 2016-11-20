# 表单校验

## 用法

```js
var form = new FormChecker(querySelector, rules);
```

`querySelector`为选择器，rules格式为：

```js
var rules = {
    name: {
        isRequire: true,
        minLength: 3,
        maxLength: 10,
        exp: /^[A-Za-z]+$/
    },
    age: {
        minLength: 1,
        maxLength: 2,
        exp: /^[\d]+$/,
        checker: function(value) {
            return value >= 18 && value <= 65;
        }
    }
};
```

key值为form中name值，value为校验对象。

校验对象属性：

* `isRequire` 是否必输

* `minLength` 最小长度（仅适用于input[text],input[password]和textarea）

* `maxLength` 最小长度（仅适用于input[text],input[password]和textarea）

* `exp`  正则表达式验证

* `checker` 其他自定义验证