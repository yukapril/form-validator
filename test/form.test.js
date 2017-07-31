const FormValidator = require('../src/index')

// create form items
let inputName = document.createElement('input')
inputName.type = 'text'
inputName.name = 'name'

let inputAge = document.createElement('input')
inputAge.type = 'text'
inputAge.name = 'age'


test('form validator', () => {
    let rules = [
        {
            name: 'name',
            isRequired: true,
            minLength: 3,
            maxLength: 10,
            rep: /^\d+$/,
            fn: (val) => {
                return val.startsWith('abc')
            }
        }
    ]

    let input1 = inputName.cloneNode(true)
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, rules)
    expect(fv1.validator.name.isRequired).toBeFalsy()
    expect(fv1.validator.name.minLength).toBeFalsy()
    expect(fv1.validator.name.maxLength).toBeTruthy()

    let input2 = inputName.cloneNode(true)
    input2.value = '123456789000'
    let form2 = document.createElement('form')
    form2.appendChild(input2)
    let fv2 = new FormValidator(form2, rules)
    expect(fv2.validator.name.isRequired).toBeTruthy()
    expect(fv2.validator.name.minLength).toBeTruthy()
    expect(fv2.validator.name.maxLength).toBeFalsy()

    let input3 = inputName.cloneNode(true)
    input3.value = 'abcd'
    let form3 = document.createElement('form')
    form3.appendChild(input3)
    let fv3 = new FormValidator(form3, rules)
    expect(fv3.validator.name.rep).toBeFalsy()
    expect(fv3.validator.name.fn).toBeTruthy()
})

test('form addElement', () => {
    let input1 = inputName.cloneNode(true)
    let input2 = inputAge.cloneNode(true)
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    fv1.addElement(input2)
    expect(fv1.$$data.$childs).toContainEqual({el: input2, name: input2.name})
})

test('form addElement return', () => {
    let input1 = inputName.cloneNode(true)
    let input2 = inputAge.cloneNode(true)
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    expect(fv1.addElement(input2)).toEqual(fv1)
})

test('form addElement no name', () => {
    let input1 = inputName.cloneNode(true)
    input1.name = ''
    let form1 = document.createElement('form')
    let fv1 = new FormValidator(form1, [])
    let fn = () => {
        fv1.addElement(input1)
    }
    expect(fn).toThrow()
})

test('form getValue', () => {
    let input1 = inputName.cloneNode(true)
    input1.value = 'test'
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    expect(fv1.getValue('name')).toBe('test')
    expect(fv1.getValue()).toEqual({name: 'test'})
})

test('form getValue non-exist', () => {
    let input1 = inputName.cloneNode(true)
    input1.value = 'test'
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    expect(fv1.getValue('abc')).toBeNull()
})

test('form setValue', () => {
    let input1 = inputName.cloneNode(true)
    input1.value = 'test'
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    fv1.setValue('name', 'newVal')
    expect(fv1.getValue('name')).toBe('newVal')
})

test('form setValue no value', () => {
    let input1 = inputName.cloneNode(true)
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let fv1 = new FormValidator(form1, [])
    expect(fv1.setValue('name')).toEqual(fv1)
})

test('form forceValidate', done => {
    let input1 = inputAge.cloneNode(true)
    input1.value = '1234'
    let form1 = document.createElement('form')
    form1.appendChild(input1)
    let rules = [
        {
            name: 'age',
            isRequired: true,
            minLength: 1,
            maxLength: 2
        }
    ]
    let fv1 = new FormValidator(form1, rules)
    fv1.on('age', (validator) => {
        expect(validator.maxLength).toBeFalsy()
        done()
    })
    fv1.forceValidate()
})

test('form element type', () => {
    let select = document.createElement('select')
    select.name = 'sex'

    let form1 = document.createElement('form')
    form1.appendChild(select)

    let fv1 = new FormValidator(form1, [])
    expect(fv1.$$data.$childs.length).toBe(0)
})

test('form input type', () => {
    let input = document.createElement('input')
    input.type = 'checkbox'
    input.name = 'sex'

    let form1 = document.createElement('form')
    form1.appendChild(input)

    let fv1 = new FormValidator(form1, [])
    expect(fv1.$$data.$childs.length).toBe(0)
})