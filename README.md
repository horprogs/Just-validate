# Just-validate
Lightweight (~4,5kb gzip) form validation in Javascript Vanilla, without dependencies, with customizable rules (including remote validation), customizable messages and customizable submit form with ajax helper.

Demo: <br>
Classic validation <https://horprogs.github.io/Just-validate/> <br>
Classic validation with tooltips <https://horprogs.github.io/Just-validate/tooltip.html>

## How to use
### npm
```shell
npm install just-validate --save
```

### yarn
```shell
yarn add just-validate
```

Include the script of the Just-validate on your page
```html
<script src="./path/to/just-validate.min.js"></script>
...
</body>
```

## Create your form
```html
<form action="#" class="js-form form">
    <div class="row">
      <div class="form-group col-md-6">
        <label for="name">Enter your name</label>
        <input type="text" class="form__input form-control" placeholder="Enter your name" autocomplete="off" data-validate-field="name" name="name" id="name">
      </div>
      <div class="form-group col-md-6">
        <label for="email">Enter your email</label>
        <input type="email" class="form__input form-control" placeholder="Enter your email" autocomplete="off" data-validate-field="email" name="email" id="email">
      </div>
    </div>
    <div class="form-group">
      <label for="password">Enter your password</label>
      <input type="password" class="form__input form-control" placeholder="Enter your password" autocomplete="off" data-validate-field="password" name="password" id="password">
    </div>
    <div class="form-group">
      <label for="password">Enter your text</label>
      <textarea name="msg" cols="30" rows="10" class="form__textarea form-control" data-validate-field="text" id="text"></textarea>
    </div>
    <div class="form-group">
      <input type="checkbox" id="checkbox" class="form__checkbox" data-validate-field="checkbox" checked><label for="checkbox">I agree</label>
    </div>
    <div class="form-group">
      <label><input type="checkbox" class="form__checkbox" data-validate-field="checkbox2" checked>I agree</label>
    </div>
    <div class="form-group">
      <label><input type="radio" name="radio" class="form__radio" data-validate-field="radio">Male</label>
      <br>
      <label><input type="radio" name="radio" class="form__radio" data-validate-field="radio">Female</label>
    </div>
    <button class="form__btn btn btn-primary">SUBMIT</button>
  </form>
```

## Fields
`` data-validate-field `` : Name of field to which the rule will be applied

Plugin has default fields, which already have rules.

**Field: email** 

*   required
*   email
*   remote

**Field: name** 

*   required
*   minLength: 3
*   maxLength: 15

**Field: text** 

*   required
*   minLength: 5
*   maxLength: 300

**Field: password** 

*   required
*   password (at least 1 digit and 1 letter)
*   minLength: 4
*   maxLength: 8

**Field: zip** 

*   required
*   zip (4-5 digits)

**Field: phone** 

*   phone (format 111-222-3333)
    

You can create your own fields, e.g. ``data-validate-field="myField"``.

## Rules

*   required -  Required field, not empty
*   email - Check a valid email address
*   minLength - Limit the minimum value
*   maxLength - Limit the maximum value
*   password - At least 1 letter and 1 digit
*   zip - 4-5 digits
*   phone - Format 111-222-3333
*   remote - validate value via remote api
*   strength - validate field for default or custom regexp
*   function - provide your own validation function

More about ``remote`` rule:
Rule check remote server api for correct answer. For example:
```js
remote: {
    url: '/check-correct',
    successAnswer: 'OK',
    sendParam: 'email',
    method: 'GET'
}
```
*   url - remote server api url
*   successAnswer - expected response from server, if value is correct
*   sendParam - parameter to be sent to server
*   method - GET or POST

More about `function` rule:
Provide a function which takes two arguments `name` and `value` and returns true or false

*   name - the name of the element
*   value - the value of the element

The following example will only validate input of a field if it is "hi"

```js
function: (name, value) => {
    if (name === 'hi') {
        return true;
    } else {
        return false;
    };
}
```

**Strength rule format:**
Default (at least one uppercase letter, one lowercase letter and one number):
```js
strength: {
    default: true
}
```

Custom (use your own regexp for check):
```js
strength: {
    custom: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]'
}
```
## Settings
```js
new window.JustValidate(element, options);
```

*   element - string, selector of DOM element
*   options - object

Initiate plugin:

First argument - selector of DOM element.
```js
new window.JustValidate('.js-form');
```

In this case default rules and messages will be applied.

Also, you can customize validation:
```js
new JustValidate('.js-form', {
    rules: {
      checkbox: {
        required: true
      },
      myField: {
        required: true
      },
      email: {
        required: false,
        email: true
      },
      password: {
        strength: {
          default: true,
        }
    },
    messages: {
      name: {
        minLength: 'My custom message about only minLength rule'
      },
      email: 'My custom message about error (one error message for all rules)'
    },

    submitHandler: function (form, values, ajax) {

      ajax({
        url: 'https://just-validate-api.herokuapp.com/submit',
        method: 'POST',
        data: values,
        async: true,
        callback: function(response)  {
          console.log(response)
        }
      });
    },
  });
```

You can override custom message for once rule or for all at once rules.

Also, you can validate for required radiobuttons. For this, you need to create ``input[type="radio"]`` fields with identical ``data-validate-field`` (it's important).

### Submit form
You can override standard submit form, using method ``submitHandler``. It has 3 arguments:
	
*   form - DOM link to form
*   values - object of fields values
*   ajax - function of XMLHttpRequest

Function ajax helps you to send XMLHTTPRequest.

Format:
```js
ajax({
    url: 'https://just-validate-api.herokuapp.com/submit',
    method: 'POST',
    data: values,
    async: true,
    callback: function(response)  {
      console.log(response)
    }
});
```

There is a property `focusWrongField` (default false), which turns on focusing on the first incorrect input after submit.
 
There is a method `invalidFormCallback`, which runs when validation failed. It takes one argument: object with errors messages.

### Tooltip

You can show errors in the form of tooltips. <br>

To do this, connect the file styles ``dist/css/justValidateTooltip.css`` or
 ``dist/css/justValidateTooltip.min.css`` on page. <br>
```html
<link rel="stylesheet" href="./path/to/justValidateTooltip.min.css">
```

For a container inside of which input, add a class ``just-validate-tooltip-container`` or add our class

```html
 <div class="form-group col-md-6">
    <label for="name">Enter your name</label>
    <div class="just-validate-tooltip-container">
        <input type="text" class="form__input form-control" placeholder="Enter your name" data-validate-field="name">
    </div>
 </div>
```

You can customize time show of error, using property ``fadeOutTime``, for example: <br>
```js
new window.JustValidate('.js-form', {
    tooltip: {
        fadeOutTime: 4000 // default value - 5000 
    }
});
```

You can customize class hide of tooltip, using property ``fadeOutClass``, for example: <br>
```js
new window.JustValidate('.js-form', {
    tooltip: {
        fadeOutClass: '.hide' // default value - just-validate-tooltip-hide
    }
});
```

You can customize class inside of which input, using property ``selectorWrap``, for example: <br>
```js
new window.JustValidate('.js-form', {
    tooltip: {
        selectorWrap: '.tooltip-wrapper' // default value - just-validate-tooltip-container
    }
});
```

### Styling

You can customize style color of error, using property ``colorWrong``, for example: <br>
```js
new window.JustValidate('.js-form', {
    colorWrong: 'red'
});
```

Error fields and messages have classes: ``js-validate-error-label`` and  ``js-validate-error-field``

### Examples
#### Validate multiple remote values with custom messages

```js
new window.JustValidate('.js-form-1', {
    rules: {
        email: {
            email: true,
            remote: {
                url: 'https://just-validate-api.herokuapp.com/check-correct',
                sendParam: 'email',
                successAnswer: 'OK',
                method: 'GET'
            }
        },
        login: {
            remote: {
                url: 'https://just-validate-api.herokuapp.com/check-correct',
                sendParam: 'login',
                successAnswer: 'OK',
                method: 'GET'
            }
        }
    },
    messages: {
        email: {
            remote: 'Email already exist',
            email: 'Email not valid!'
        },
        login: {
            remote: 'Login already exist',
            required: 'Login is required!'
        }
    },
});
```
#### Classic validation with custom submit form and ajax helper
```js
new window.JustValidate('.js-form', {
    rules: {
        checkbox: {
            required: true
        },
        checkbox2: {
            required: true
        },
        email: {
            required: true,
            email: true,
        }
    },
    
    focusWrongField: true,

    submitHandler: function (form, values, ajax) {
        ajax({
            url: 'https://just-validate-api.herokuapp.com/submit',
            method: 'POST',
            data: values,
            async: true,
            callback: function (response) {
                alert('AJAX submit successful! \nResponse from server:' + response)
            },
            error: function (response) {
                alert('AJAX submit error! \nResponse from server:' + response)
            }
        });
    },
    
    invalidFormCallback: function (errors) {
    		console.log(errors);
    },
});
```

## Changelog
### 1.1.0
Added rule for check strength of password  (default and custom)
### 1.2.0
Added tooltip style error
### 1.3.0
Added feature for check required radio buttons
### 1.4.0
Added feature to allow the user to provide their own validation function
### 1.5.0
Added feature for focus incorrect field after validation
Added callback, when validation failed

## Contributing
	* Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
	* Fork repository, make changes, add your name and link in the authors session readme.md
	* Send a pull request

**Thank you**


