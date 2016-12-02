(function (window) {
    'use strict';

    const
        RULE_REQUIRED = 'required',
        RULE_EMAIL = 'email',
        RULE_MINLENGTH = 'minLength',
        RULE_MAXLENGTH = 'minLength',
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
        this.rules = this.options.rules || undefined;
        this.messages = this.options.messages || undefined;
        this.result = {};
        this.elements = [];
        this.REGEXP = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
            password: /^(?=.*\d).{0,}$/
        };
        this.DEFAULT_ERROR = 'Error';
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
                remote: ['http://localhost:7777/check', 'OK']
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
            minLength: 'Too short'
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
            let elems = this.$form.querySelectorAll('[data-validate-name]');
            for (let i = 0, len = elems.length; i < len; ++i) {
                let item = elems[i],
                    name = item.getAttribute('data-validate-name'),
                    value = item.value;

                this.elements.push({
                    name,
                    value
                });
            }
            this.validateElements();
        },

        checkRemoteResponse: function (data) {
            if (data) {
                console.log('123')
                return true;
            }
            return;
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
         * @param {string} url
         * @param {string} answerTrue
         * @returns {boolean} True if validate is OK
         */
        validateRemote: function (value, url, answerTrue) {
            ajax({
                url: url,
                method: 'GET',
                data: value,
                callback: (data) => {
                    if (data === answerTrue) {
                        this.checkRemoteResponse(true);
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
                (this.DEFAULT_ERROR);

            this.result[name] = {
                message: customMessage
            };
        },

        validateElements: function () {
            this.elements.forEach((item) => {
                this.validateItem(item);
            });
            // this.renderErrors();
            // this.tests.result = this.result;
        },

        validateItem: function ({name, value}) {
            let rules = this.rules[name] || this.defaultRules[name] || undefined;

            if (!rules) {
                return;
            }
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
                        break;
                    }

                    case RULE_MINLENGTH: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMinLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MINLENGTH, name);
                        break;
                    }

                    case RULE_MAXLENGTH: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMaxLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MAXLENGTH, name);
                        break;
                    }

                    case RULE_PHONE: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePhone(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PHONE, name);
                        break;
                    }

                    case RULE_PASSWORD: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validatePassword(value)) {
                            break;
                        }
                        this.generateMessage(RULE_PASSWORD, name);
                        break;
                    }

                    case RULE_ZIP: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateZip(value)) {
                            break;
                        }
                        this.generateMessage(RULE_ZIP, name);
                        break;
                    }

                    case RULE_REMOTE: {
                        if (!ruleValue) {
                            break;
                        }
                        let url = ruleValue[0],
                            answerTrue = ruleValue[1];
                        console.log(this.validateRemote(value, url, answerTrue));;

                        // if (this.c) {
                        //     console.log('val-ok')
                        //     break;
                        // }
                        this.generateMessage(RULE_ZIP, name);
                        break;
                    }
                }
            }
        },

        clearErrors: function () {
            let $elems = document.querySelectorAll('.js-validate-error');
            for (let i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].remove();
            }
        },

        renderErrors: function () {

            this.clearErrors();

            for (let item in this.result) {
                let message = this.result[item].message;
                let $elems = this.$form.querySelectorAll(`[data-validate-name="${item}"`);

                for (let i = 0, len = $elems.length; i < len; ++i) {
                    let div = document.createElement('div');
                    div.innerHTML = message;
                    div.className = 'js-validate-error';
                    $elems[i].parentNode.insertBefore(div, $elems[i].nextSibling);
                }
            }
        }
    };

    window.JSvalidation = JSvalidation;
}(window));


