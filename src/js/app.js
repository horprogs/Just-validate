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
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    callback(this.responseText);
                }
            }
        };
        xhr.send(data);
    };

    const JSvalidation = function (selector, options) {
        this.options = options || {};
        this.rules = this.options.rules || {};
        this.messages = this.options.messages || undefined;
        this.colorWrong = this.colorWrong || '#B81111';
        this.result = {};
        this.elements = [];
        this.REGEXP = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
            password: /^(?=.*\d).{0,}$/
        };
        this.DEFAULT_REMOTE_ERROR = 'Error';
        this.DEFAULT_REMOTE_URL = 'http://localhost:7777/check-correct';

        // this.val({
        //     name: 'password',
        //     value: '12345'
        // });

        this.setForm(document.querySelector(selector));
    };

    JSvalidation.prototype = {
        defaultRules: {
            email: {
                required: true,
                email: true,
                remote: ['http://localhost:7777/check-correct', 'OK']
            },
            name: {
                minLength: 3,
                maxLength: 15,
                required: true
            },
            text: {
                maxLength: 300,
                required: true
            },
            password: {
                minLength: 4,
                maxLength: 8,
                password: true,
                required: true
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
            password: 'Password is not valid'
        },

        setForm: function (form) {
            this.$form = form;
            this.$form.setAttribute('novalidate', 'novalidate');
            this.$form.addEventListener('submit', (ev) => {
                ev.preventDefault();
            });
            this.getElements();
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
            for (let i = 0, len = elems.length; i < len; ++i) {
                let item = elems[i],
                    name = item.getAttribute('data-validate-field'),
                    value = item.value;

                if (item.type === 'checkbox') {
                    value = item.checked || '';
                }

                this.elements.push({
                    name,
                    value
                });

                item.addEventListener('keyup', (ev) => {
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
         * @param {string} answerTrue
         * @returns {boolean} True if validate is OK
         */
        validateRemote: function (value, name, url, answerTrue) {
            ajax({
                url: url,
                method: 'GET',
                data: value,
                callback: (data) => {
                    if (data !== answerTrue) {
                        this.generateMessage(RULE_REMOTE, name);
                    }
                }
            });
        },

        generateMessage: function (rule, name) {
            let messages = this.messages || this.defaultMessages;

            let customMessage =
                (messages[name] && messages[name][rule]) ||
                ((typeof messages[name] === 'string') && messages[name]) ||
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
            // this.renderErrors();
            // this.tests.result = this.result;
        },

        validateItem: function ({name, value}) {
            let rules = this.rules[name] || this.defaultRules[name] || false;

            if (!rules) {
                return;
            }
            for (let rule in rules) {
                let ruleValue = rules[rule];
                switch (rule) {
                    case RULE_REQUIRED:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateRequired(value)) {
                            break;
                        }
                        this.generateMessage(RULE_REQUIRED, name);
                        return;
                    }

                    case RULE_EMAIL:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateEmail(value)) {
                            break;
                        }
                        this.generateMessage(RULE_EMAIL, name);
                        return;
                    }

                    case RULE_MINLENGTH:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMinLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MINLENGTH, name);
                        return;
                    }

                    case RULE_MAXLENGTH:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMaxLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MAXLENGTH, name);
                        return;
                    }

                    case RULE_PHONE:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePhone(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PHONE, name);
                        return;
                    }

                    case RULE_PASSWORD:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePassword(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PASSWORD, name);
                        return;
                    }

                    case RULE_ZIP:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateZip(value)) {
                            break;
                        }
                        this.generateMessage(RULE_ZIP, name);
                        return;
                    }

                    case RULE_REMOTE:
                    {
                        if (!ruleValue) {
                            break;
                        }
                        let url = ruleValue[0],
                            answerTrue = ruleValue[1];
                        this.validateRemote(value, name, url, answerTrue);
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
            let submitBtn = this.$form.querySelector('input[type="submit"]') || this.$form.querySelector('button');

            if (Object.keys(this.result).length === 0) {
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.removeAttribute('disabled');
                return;
            }

            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.webitFilter = 'grayscale(100%)';
            submitBtn.style.filter = 'grayscale(100%)';
            submitBtn.setAttribute('disabled', 'disabled');

            for (let item in this.result) {
                let message = this.result[item].message;
                let $elems = this.$form.querySelectorAll(`[data-validate-field="${item}"`);

                for (let i = 0, len = $elems.length; i < len; ++i) {
                    let div = document.createElement('div'),
                        item = $elems[i];

                    div.innerHTML = message;
                    div.className = 'js-validate-error-label';
                    div.setAttribute('style', `color: ${this.colorWrong}`);
                    item.parentNode.insertBefore(div, item.nextSibling);
                    item.style.border = `1px solid ${this.colorWrong}`;
                    item.style.color = `${this.colorWrong}`;
                    item.classList.add('js-validate-error-field');
                }
            }
        }
    };

    window.JSvalidation = JSvalidation;
}(window));

new window.JSvalidation('.js-form', {
    rules: {
        checkbox: {
            required: true
        }
    }
});


