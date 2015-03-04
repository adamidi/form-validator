jQuery Validator plugin
=======================

Bootstrap form validator jQuery plugin that allows you to add your own custom validators, for single or multiple inputs.

Currently there are only two built-in validators: email and required.

How to use
----------

### The "validator" attribute ###

The way the plugin identifies which fields should be validated by which validator, is by using its own custom attribute.
So for the validation of an input, you have to include the "validator" attribute adding as value the name of the validator :

```html
<input type="text" validator="required">
```

Available built-in validators : **email**, **required**.

### Simple call ###

```js
$("#formId").validator();
```

This way, the plugin runs only with the built-in validators and default options.

### Call with options ###

This way you can change the default options. Currently, these are the error messages for email validation and required fields.

Example:

```js
$("#formId").validator({errorMsgs: {email: "my msg"}});
```

### Add custom validator ###

To add your own validator you need three things : 
	- a function that takes a jquery element as input and returns true or false
	- a value for the "validator" attribute by which the plugin can recognize which inputs are going to be validated with your function
	- an error message

Firstly define your function :

```js
var myFunction(elem) = {..returns true or false..}
```

*Note*: If you want a field to be optional, then you have to include this in your function's logic so that it returns true also for blank inputs.

And then call the addValidator function of the plugin using this syntax:

```js
$("formId").validator('addValidator', ["your_validators_name", myFunction, "your error message"]);
```

If you don't need an error message, just enter an empty string.

Don't forget to include your attribute value to the html.

```html
<input validator = "your_validators_name">.
```

### Add your own group validator ###

In this case, the only difference from adding single input validators is that:
- the attribute used now is "group-validator" instead of "validator"
- the attribute "group-validator" is added to the parent of the input group
- the custom validation function takes as argument an array of elements
- you have to call addGroupValidator instead of addValidator

So, to add your own group validator you need :
- a function that takes an array of jQuery elements as input and returns true or false
- a value for the "group-validator" attribute
- an error message

Firstly define your function :

```js
var myGroupFunction(elementArray) = {..returns true or false..}
```

And then call the addGroupValidator function of the plugin using this syntax:

```js
$("formId").validator('addGroupValidator', ["your_group_validators_name", myGroupFunction, "your error message"]);
```

If you don't need an error message, just enter an empty string.

Also include your attribute value to the html. **The attribute "group-validator" must be added to the parent element of the group of inputs you want to validate**.

```html
<div group-validator="your_group_validators_name">
<input..>
<input..>
..
</div>
```



