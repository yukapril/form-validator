/**
 * 查找表单元素
 * @param $el
 * @returns {Array}
 */
const getChildElements = ($el) => {
  let childs = $el.querySelectorAll('[name]')
  if (childs.length === 0) return []
  // 筛选出有效的元素
  return Array.prototype.reduce.call(childs, (arr, c) => {
    let tagName = c.tagName.toLowerCase()
    let type = c.type
    let allowTagName = ['input', 'textarea']
    let allowTypes = ['text', 'password', 'tel', 'number']
    if (allowTagName.indexOf(tagName) >= 0) {
      if (tagName === 'input') {
        if (allowTypes.indexOf(type) >= 0) arr.push(c)
      } else {
        arr.push(c)
      }
    }

    return arr
  }, [])
}

/**
 * 获取单一元素
 * @param el
 * @returns {*}
 */
const getElement = (el) => {
  if (typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

/**
 * 元素绑定触发事件
 * @param element
 * @param type
 * @param callback
 */
const bindEvent = (element, type, callback) => {
  element.addEventListener(type, e => {
    callback.call(e.target, e)
  })
}

/**
 * 元素拦截器
 * @param element
 * @param callback
 */
const interceptorEvent = (element, callback) => {
  element.onkeypress = (e) => {
    e = e || window.event
    return callback.call(e.target, e)
  }
}

/**
 * 检验表单项
 * @param element
 * @param name
 * @param rule
 * @param isFirstRun
 * @returns {{isRequired: boolean, minLength: boolean, maxLength: boolean, rep: boolean, fn: boolean, $modify: boolean, $valid: boolean}}
 */
const checkFormItem = (element, name, rule, isFirstRun) => {
  isFirstRun = !!isFirstRun
  let obj = {
    name,
    isRequired: true,
    minLength: true,
    maxLength: true,
    rep: true,
    fn: true,
    $modify: false,
    $valid: true
  }

  let value = element.value
  if (rule) {
    if (rule.isRequired) obj.isRequired = !!value
    if (rule.minLength) obj.minLength = value.length >= rule.minLength
    if (rule.maxLength) obj.maxLength = value.length <= rule.maxLength
    if (rule.rep) obj.rep = rule.rep.test(value)
    if (rule.fn) obj.fn = !!rule.fn.call(null, value)
  }
  if (!isFirstRun) obj.$modify = true
  obj.$valid = obj.isRequired && obj.minLength && obj.maxLength && obj.rep && obj.fn

  return obj
}

class FormValidator {
  constructor (element, rules) {
    let $el // 表单元素
    let $childs = [] // 表单子元素
    let eventList = [] // 事件列表
    let interceptorList = [] // 拦截器列表
    let validator = {} // 表单验证结果

    // 处理表单元素
    if (element) {
      $el = getElement(element)
    }

    this.$$data = {
      $el,
      $childs,
      rules,
      eventList,
      interceptorList,
      validator
    }
    this.validator = validator

    // 处理表单子元素
    if ($el) {
      $childs = getChildElements($el)
      $childs.forEach(c => this.addElement(c))
    }
  }

  /**
   * 增加表单元素
   * @param element
   * @param name
   */
  addElement (element, name) {
    let $el = getElement(element)
    if (!name) name = $el.name
    if (!name) {
      throw new Error('[FormChecker] addElement Method must have param `name`')
    }

    // 写入子元素对象
    this.$$data.$childs.push({el: $el, name})

    let rule = this.$$data.rules.filter(i => i.name === name)[0]

    // 首次校验
    this.$$data.validator[name] = checkFormItem($el, name, rule, true)

    let eventList = this.$$data.eventList
    // input 事件
    bindEvent($el, 'input', e => {
      let el = e.target
      // 验证输入
      let validator = checkFormItem(el, name, rule)
      this.$$data.validator[name] = validator
      eventList.forEach(event => {
        if (event.name === '' || event.name === name) {
          if (!event.isLazy) event.handler.call(el, validator, e)
        }
      })
    })
    // blur 事件
    bindEvent($el, 'blur', e => {
      let el = e.target
      // 验证输入
      let validator = checkFormItem(el, name, rule)
      this.$$data.validator[name] = validator
      eventList.forEach(event => {
        if (event.name === '' || event.name === name) {
          if (event.isLazy) event.handler.call(el, validator, e)
        }
      })
    })

    let interceptorList = this.$$data.interceptorList
    // 输入拦截器
    interceptorEvent($el, e => {
      let ret = true
      interceptorList.some(i => {
        if (i.name === '' || i.name === name) {
          ret = i.handler.call($el, e)
          return true
        }
        return false
      })
      return ret
    })
    return this
  }

  /**
   * 监听事件
   * @param name
   * @param handler
   * @param isLazy
   */
  on (name, handler, isLazy) {
    if (typeof handler === 'boolean') {
      isLazy = handler
    }
    if (typeof name === 'function') {
      handler = name
      name = ''
    }
    isLazy = !!isLazy
    let eventList = this.$$data.eventList
    eventList.push({name, handler, isLazy})
    return this
  }

  interceptor (name, handler) {
    if (typeof name === 'function') {
      handler = name
      name = ''
    }
    let interceptorList = this.$$data.interceptorList
    interceptorList.push({name, handler})
    return this
  }

  /**
   * 强制校验
   */
  forceValidate () {
    let $childs = this.$$data.$childs
    let rules = this.$$data.rules
    let eventList = this.$$data.eventList

    eventList.forEach(event => {
      // 不处理懒监听
      if (event.isLazy) return
      if (event.name) {
        // 监听单一元素情况
        let elObj = $childs.filter(c => {
          if (c.name === event.name) return c
        })[0]
        if (!elObj) return this
        let rule = rules.filter(i => i.name === event.name)[0]
        let validator = checkFormItem(elObj.el, event.name, rule)
        event.handler.call(elObj.el, validator)
      } else {
        // 监听所有元素情况
        $childs.forEach(c => {
          let rule = rules.filter(i => i.name === c.name)[0]
          let validator = checkFormItem(c.el, c.name, rule)
          event.handler.call(c.el, validator)
        })
      }
    })
    return this
  }

  /**
   * 获取表单值
   * @param name
   */
  getValue (name) {
    let $childs = this.$$data.$childs
    if (name) {
      // 获取单个元素值
      let ret = null
      $childs.some(i => {
        if (i.name === name) {
          ret = i.el.value
          return true
        }
        return false
      })
      return ret
    } else {
      // 获取所有元素值
      return $childs.reduce((val, i) => {
        val[i.name] = i.el.value
        return val
      }, {})
    }
  }

  /**
   * 表单元素赋值
   * @param name
   * @param val
   */
  setValue (name, val) {
    if (!name || !val) return this
    let $childs = this.$$data.$childs
    let rules = this.$$data.rules
    let eventList = this.$$data.eventList
    $childs.some(i => {
      if (i.name === name) {
        i.el.value = val
        // 触发验证
        let rule = rules.filter(i => i.name === name)[0]
        let validator = checkFormItem(i.el, name, rule)
        eventList.forEach(event => {
          if (event.name === '' || event.name === name) {
            event.handler.call(i.el, validator)
          }
        })
        return true
      }
      return false
    })
    return this
  }
}

module.exports = FormValidator