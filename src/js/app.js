(function (window) {
    'use strict';

    const
        RULE_REQUIRED = 'required',
        RULE_EMAIL = 'email',
        RULE_MINLENGTH = 'minLength',
        RULE_MAXLENGTH = 'maxLength',
        RULE_PASSWORD = 'password',
        RULE_ZIP = 'zip',
        RULE_PHONE = 'phone',
        RULE_REMOTE = 'remote';

    const formatParams = function (params, method) {
        if (typeof params === 'string') {
            return params;
        }

        var letter = (method.toLowerCase() === 'post') ? '' : '?';
        if (Array.isArray(params)) {
            return letter + params
                    .map(function (obj) {
                        return obj.name + "=" + obj.value;
                    })
                    .join("&");
        }
        return letter + Object
                .keys(params)
                .map(function (key) {
                    return key + "=" + params[key];
                })
                .join("&");
    };

    const ajax = function (options) {
        var url = options.url,
            method = options.method,
            data = options.data,
            debug = options.debug,
            callback = options.callback;

        if (debug) {
            callback('test');
            return;
        }

        var async = (options.async === false) ? false : true;
        var xhr = new XMLHttpRequest();
        var params = formatParams(data, 'get');
        var body = null;

        if (method.toLowerCase() === 'post') {
            body = formatParams(data, 'post');
            params = '';
        }

        xhr.open(method, url + params, async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    callback(this.responseText);
                }
            }
        };
        xhr.send(body);
    };

    const JSvalidation = function (selector, options) {
        this.options = options || {};
        this.rules = this.options.rules || {};
        this.messages = this.options.messages || undefined;
        this.colorWrong = this.options.colorWrong || '#B81111';
        this.result = {};
        this.elements = [];
        this.bindHandlerKeyup = this.handlerKeyup.bind(this);
        this.submitHandler = this.options.submitHandler || undefined;
        this.REGEXP = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
            password: /[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))/
        };
        this.DEFAULT_REMOTE_ERROR = 'Error';
        this.DEFAULT_REMOTE_URL = 'http://localhost:7777/check-correct';

        this.setForm(document.querySelector(selector));
    };

    JSvalidation.prototype = {
        defaultRules: {
            email: {
                required: true,
                email: true,
                remote: {
                    url: 'http://localhost:7777/check-correct',
                    successAnswer: 'OK',
                    sendParam: 'email',
                    method: 'GET'
                }
            },
            name: {
                required: true,
                minLength: 3,
                maxLength: 15
            },
            text: {
                required: true,
                maxLength: 300,
                minLength: 5
            },
            password: {
                required: true,
                password: true,
                minLength: 4,
                maxLength: 8
            },
            zip: {
                required: true,
                zip: true
            },
            phone: {
                phone: true
            }
        },

        defaultMessages: {
            required: 'Field is required',
            email: 'Not valid email',
            maxLength: 'Too much',
            minLength: 'Too short',
            password: 'Password is not valid',
            remote: 'Email already exists'
        },

        handlerKeyup: function (ev) {
            let elem = ev.target,
                item = {
                    name: elem.getAttribute('data-validate-field'),
                    value: elem.value
                };
            delete this.result[item.name];
            this.validateItem({
                name: item.name,
                value: item.value
            });
            this.renderErrors();
        },

        setterEventListener: function (item, event, handler, type) {
            if (event === 'keyup') {
                handler = this.bindHandlerKeyup;
            }
            switch (type) {
                case 'add': {
                    item.addEventListener(event, handler);
                    break;
                }
                case 'remove': {
                    item.removeEventListener(event, handler);
                    break;
                }
            }
        },

        setForm: function (form) {
            this.$form = form;
            this.$form.setAttribute('novalidate', 'novalidate');
            this.$form.addEventListener('submit', (ev) => {
                ev.preventDefault();
                this.result = [];
                this.getElements();

                if (Object.keys(this.result).length === 0) {
                    // this._blockSubmitBtn();
                    if (this.submitHandler) {
                        this.submitHandler(this.$form, this.elements, ajax);
                        return;
                    }

                    this.$form.submit();
                    return;
                }
            });
        },

        isEmail: function (email) {
            return this.REGEXP.email.test(email);
        },

        isZip: function (zip) {
            return this.REGEXP.zip.test(zip);
        },

        isPhone: function (phone) {
            return this.REGEXP.phone.test(phone);
        },

        isPassword: function (password) {
            return this.REGEXP.password.test(password);
        },

        isEmpty: function (val) {
            return !val;
        },

        checkLengthMax: function (text, max) {
            return text.length <= max;
        },

        checkLengthMin: function (text, min) {
            return text.length > min;
        },

        getElements: function () {
            let elems = this.$form.querySelectorAll('[data-validate-field]');
            this.elements = [];

            for (let i = 0, len = elems.length; i < len; ++i) {
                let item = elems[i],
                    name = item.getAttribute('data-validate-field'),
                    value = item.value;

                if (item.type === 'checkbox') {
                    value = item.checked || '';

                    item.addEventListener('change', (ev) => {
                        let elem = ev.target,
                            item = {
                                name: elem.getAttribute('data-validate-field'),
                                value: elem.checked
                            };

                        delete this.result[item.name];
                        this.validateItem({
                            name: item.name,
                            value: item.value
                        });
                        this.renderErrors();

                    });
                }
                this.setterEventListener(item, 'keyup', this.handlerKeyup, 'add');
                // let bindFunc = this.handlerKeyup.bind(this)
                // item.addEventListener('keyup', bindFunc, false);

                this.elements.push({
                    name,
                    value
                });

            }

            this.validateElements();
        },

        /**
         * Validate Required field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateRequired: function (value) {
            return !this.isEmpty(value);
        },

        /**
         * Validate Email field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateEmail: function (value) {
            return this.isEmail(value);
        },

        /**
         * Validate Phone field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePhone: function (value) {
            return this.isPhone(value);
        },

        /**
         * Validate field for Min Length
         * @param {string} value Value for validate
         * @param {integer} min
         * @returns {boolean} True if validate is OK
         */
        validateMinLength: function (value, min) {
            return this.checkLengthMin(value, min);
        },

        /**
         * Validate field for Max Length
         * @param {string} value Value for validate
         * @param {integer} max
         * @returns {boolean} True if validate is OK
         */
        validateMaxLength: function (value, max) {
            return this.checkLengthMax(value, max);
        },

        /**
         * Validate Password field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePassword: function (value) {
            return this.isPassword(value);
        },

        /**
         * Validate ZIP field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateZip: function (value) {
            return this.isZip(value);
        },

        /**
         * Validate for remote check
         * @param value
         * @param name
         * @param {string} url
         * @param {string} successAnswer
         * @returns {boolean} True if validate is OK
         */
        validateRemote: function ({value, name, url, successAnswer, sendParam, method}) {
            ajax({
                url: url,
                method: method,
                data: {
                    [sendParam]: value
                },
                async: false,
                callback: (data) => {
                    if (data !== successAnswer) {
                        this.generateMessage(RULE_REMOTE, name);
                        this.renderErrors();
                    }
                }
            });
        },

        generateMessage: function (rule, name) {
            let messages = this.messages || this.defaultMessages;
            //console.log('MESSAGES', this.defaultMessages)
            //console.log('RULE', rule)
            //console.log('MSG', messages[name])
            let customMessage =
                (messages[name] && messages[name][rule]) ||
                (this.messages && (typeof this.messages[name] === 'string') && messages[name]) ||
                // (messages[name][rule]) ||
                (this.defaultMessages[rule]) ||
                (this.DEFAULT_REMOTE_ERROR);

            this.result[name] = {
                message: customMessage
            };
        },

        // clearMessage: function (rule, name) {
        //     this.result[name] = {
        //         message: customMessage
        //     };
        // },

        validateElements: function () {
            this.elements.forEach((item) => {
                this.validateItem({
                    name: item.name,
                    value: item.value
                });
            });

            this.renderErrors();
        },

        validateItem: function ({name, value}) {
            let rules = this.rules[name] || this.defaultRules[name] || false;

            if (!rules) {
                return;
            }
            //console.log('rules', rules)
            for (let rule in rules) {
                let ruleValue = rules[rule];
                switch (rule) {
                    case RULE_REQUIRED: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateRequired(value)) {
                            break;
                        }
                        this.generateMessage(RULE_REQUIRED, name);
                        return;
                    }

                    case RULE_EMAIL: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateEmail(value)) {
                            break;
                        }
                        this.generateMessage(RULE_EMAIL, name);
                        return;
                    }

                    case RULE_MINLENGTH: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMinLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MINLENGTH, name);
                        return;
                    }

                    case RULE_MAXLENGTH: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMaxLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MAXLENGTH, name);
                        return;
                    }

                    case RULE_PHONE: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePhone(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PHONE, name);
                        return;
                    }

                    case RULE_PASSWORD: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePassword(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PASSWORD, name);
                        return;
                    }

                    case RULE_ZIP: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateZip(value)) {
                            break;
                        }
                        this.generateMessage(RULE_ZIP, name);
                        return;
                    }

                    case RULE_REMOTE: {
                        if (!ruleValue) {
                            break;
                        }

                        let url = ruleValue.url,
                            successAnswer = ruleValue.successAnswer,
                            method = ruleValue.method,
                            sendParam = ruleValue.sendParam;

                        let $elem = this.$form.querySelector(`input[data-validate-field="${name}"]`);
                        this.setterEventListener($elem, 'keyup', this.handlerKeyup, 'remove');
                        this.validateRemote({name, value, url, method, sendParam, successAnswer});
                        // this._unblockSubmitBtn();
                        return;
                    }
                }
            }
        },

        clearErrors: function () {
            let $elems = document.querySelectorAll('.js-validate-error-label');
            for (let i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].remove();
            }

            $elems = document.querySelectorAll('.js-validate-error-field');
            for (let i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].classList.remove('js-validate-error-field');
                $elems[i].style.border = '';
                $elems[i].style.color = '';
            }
        },

        renderErrors: function () {
            this.clearErrors();

            if (Object.keys(this.result).length === 0) {
                this._unblockSubmitBtn();
                return;
            }

            // this._blockSubmitBtn();

            for (let item in this.result) {
                let message = this.result[item].message;
                let $elems = this.$form.querySelectorAll(`[data-validate-field="${item}"`);

                for (let i = 0, len = $elems.length; i < len; ++i) {
                    let div = document.createElement('div'),
                        item = $elems[i];

                    div.innerHTML = message;
                    div.className = 'js-validate-error-label';
                    div.setAttribute('style', `color: ${this.colorWrong}`);
                    item.style.border = `1px solid ${this.colorWrong}`;
                    item.style.color = `${this.colorWrong}`;
                    item.classList.add('js-validate-error-field');

                    if (item.type === 'checkbox') {
                        let $label = document.querySelector(`label[for="${item.getAttribute('id')}"]`);

                        if (item.parentNode.tagName.toLowerCase() === 'label') {
                            item.parentNode.parentNode.insertBefore(div, null);
                        } else if ($label) {
                            $label.parentNode.insertBefore(div, $label.nextSibling);
                        } else {
                            item.parentNode.insertBefore(div, item.nextSibling);
                        }
                        continue;
                    }

                    item.parentNode.insertBefore(div, item.nextSibling);

                }
            }
        },

        _blockSubmitBtn: function () {
            let submitBtn = this.$form.querySelector('input[type="submit"]') || this.$form.querySelector('button');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.webitFilter = 'grayscale(100%)';
            submitBtn.style.filter = 'grayscale(100%)';
            submitBtn.setAttribute('disabled', 'disabled');
        },

        _unblockSubmitBtn: function () {
            let submitBtn = this.$form.querySelector('input[type="submit"]') || this.$form.querySelector('button');
            submitBtn.style.pointerEvents = '';
            submitBtn.style.webitFilter = '';
            submitBtn.style.filter = '';
            submitBtn.removeAttribute('disabled');
        }
    };

    window.JSvalidation = JSvalidation;
}(window));

new window.JSvalidation('.js-form', {
    rules: {
        checkbox: {
            required: true
        },
        checkbox2: {
            required: true
        }

    },
    messages: {
        name: {
            minLength: 'LENGTH'
        }
    },

    submitHandler: function (form, values, ajax) {
        console.log(form, values)

        ajax({
            url: 'http://localhost:7777/submit',
            method: 'POST',
            data: values,
            async: true,
            callback: (response) => {
                console.log(response)
            }
        });
    },
});


