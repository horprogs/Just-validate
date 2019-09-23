/* global Promise */
(function(window) {
    'use strict';

    if (!window.Promise) {
        window.Promise = Promise;
    }

    const RULE_REQUIRED = 'required',
        RULE_EMAIL = 'email',
        RULE_MINLENGTH = 'minLength',
        RULE_MAXLENGTH = 'maxLength',
        RULE_PASSWORD = 'password',
        RULE_ZIP = 'zip',
        RULE_PHONE = 'phone',
        RULE_REMOTE = 'remote',
        RULE_STRENGTH = 'strength',
        RULE_FUNCTION = 'function';

    const formatParams = function(params, method) {
        if (typeof params === 'string') {
            return params;
        }

        const letter = method.toLowerCase() === 'post' ? '' : '?';
        if (Array.isArray(params)) {
            return (
                letter +
                params
                    .map(function(obj) {
                        return obj.name + '=' + obj.value;
                    })
                    .join('&')
            );
        }
        return (
            letter +
            Object.keys(params)
                .map(function(key) {
                    return key + '=' + params[key];
                })
                .join('&')
        );
    };

    const ajax = function(options) {
        const url = options.url,
            method = options.method,
            data = options.data,
            debug = options.debug,
            callback = options.callback,
            error = options.error;

        if (debug) {
            callback('test');
            return;
        }

        const async = options.async === false ? false : true;
        const xhr = new XMLHttpRequest();
        let params = formatParams(data, 'get');
        let body = null;

        if (method.toLowerCase() === 'post') {
            body = formatParams(data, 'post');
            params = '';
        }

        xhr.open(method, url + params, async);
        xhr.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    callback(this.responseText);
                } else {
                    error && error(this.responseText);
                }
            }
        };
        xhr.send(body);
    };

    const JustValidate = function(selector, options) {
        this.options = options || {};
        this.rules = this.options.rules || {};
        this.messages = this.options.messages || undefined;
        this.colorWrong = this.options.colorWrong || '#B81111';
        this.result = {};
        this.elements = [];
        this.tooltip = this.options.tooltip || {};
        this.tooltipFadeOutTime = this.tooltip.fadeOutTime || 5000;
        this.tooltipFadeOutClass =
            this.tooltip.fadeOutClass || 'just-validate-tooltip-hide';
        this.tooltipSelectorWrap = document.querySelectorAll(
            this.tooltip.selectorWrap
        ).length
            ? document.querySelectorAll(this.tooltip.selectorWrap)
            : document.querySelectorAll('.just-validate-tooltip-container');
        this.bindHandlerKeyup = this.handlerKeyup.bind(this);
        this.submitHandler = this.options.submitHandler || undefined;
        this.invalidFormCallback =
            this.options.invalidFormCallback || undefined;
        this.promisesRemote = [];
        this.isValidationSuccess = false;
        this.focusWrongField = this.options.focusWrongField || false;
        this.REGEXP = {
            // eslint-disable-next-line max-len
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
            password: /[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))/,
            strengthPass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
        };
        this.DEFAULT_REMOTE_ERROR = 'Error';
        this.state = {
            tooltipsTimer: null,
        };

        this.setForm(document.querySelector(selector));
    };

    JustValidate.prototype = {
        defaultRules: {
            email: {
                required: true,
                email: true,
            },
            name: {
                required: true,
                minLength: 3,
                maxLength: 15,
            },
            text: {
                required: true,
                maxLength: 300,
                minLength: 5,
            },
            password: {
                required: true,
                password: true,
                minLength: 4,
                maxLength: 8,
            },
            zip: {
                required: true,
                zip: true,
            },
            phone: {
                phone: true,
            },
        },

        defaultMessages: {
            required: 'The field is required',
            email: 'Please, type a valid email',
            maxLength: 'The field must contain a maximum of :value characters',
            minLength: 'The field must contain a minimum of :value characters',
            password: 'Password is not valid',
            remote: 'Email already exists',
            strength:
                'Password must contents at least one uppercase letter, one lowercase letter and one number',
            function: 'Function returned false',
        },

        /**
         * Keyup handler
         * @param ev
         */
        handlerKeyup: function(ev) {
            let elem = ev.target,
                item = {
                    name: elem.getAttribute('data-validate-field'),
                    value: elem.value,
                };
            delete this.result[item.name];
            this.validateItem({
                name: item.name,
                value: item.value,
                group: [],
                isKeyupChange: true,
            });
            this.renderErrors();
        },

        setterEventListener: function(item, event, handler, type) {
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

        getElementsRealValue: function() {
            let $elems = this.$form.querySelectorAll('*'),
                name,
                result = {};
            for (let i = 0, len = $elems.length; i < len; ++i) {
                name = $elems[i].getAttribute('name');
                if (name) {
                    if ($elems[i].type === 'checkbox') {
                        result[name] = $elems[i].checked;
                        continue;
                    }
                    result[name] = $elems[i].value;
                }
            }
            return result;
        },

        validationFailed: function() {
            if (this.invalidFormCallback) {
                this.invalidFormCallback(this.result);
            }

            const $firstErrorField = document.querySelector(
                '.js-validate-error-field'
            );

            if (
                this.focusWrongField &&
                $firstErrorField &&
                $firstErrorField.focus
            ) {
                $firstErrorField.focus();
            }
        },

        validationSuccess: function() {
            if (Object.keys(this.result).length === 0) {
                this.isValidationSuccess = false;
                if (this.submitHandler) {
                    let realValues = this.getElementsRealValue();
                    this.submitHandler(this.$form, realValues, ajax);
                    return;
                }

                this.$form.submit();
            }
        },

        setForm: function(form) {
            this.$form = form;
            this.$form.setAttribute('novalidate', 'novalidate');
            this.$form.addEventListener('submit', (ev) => {
                ev.preventDefault();
                this.result = [];
                this.getElements();

                if (!this.promisesRemote.length) {
                    if (this.isValidationSuccess) {
                        this.validationSuccess();
                    } else {
                        this.validationFailed();
                    }
                    return;
                }

                Promise.all(this.promisesRemote).then(() => {
                    this.promisesRemote = [];

                    if (this.isValidationSuccess) {
                        this.validationSuccess();
                    } else {
                        this.validationFailed();
                    }
                });
            });
        },

        isEmail: function(email) {
            return this.REGEXP.email.test(email);
        },

        isZip: function(zip) {
            return this.REGEXP.zip.test(zip);
        },

        isPhone: function(phone) {
            return this.REGEXP.phone.test(phone);
        },

        isPassword: function(password) {
            return this.REGEXP.password.test(password);
        },

        isEmpty: function(val) {
            let newVal = val;
            if (val.trim) {
                newVal = val.trim();
            }

            return !newVal;
        },

        checkLengthMax: function(text, max) {
            return text.length <= max;
        },

        checkLengthMin: function(text, min) {
            return text.length >= min;
        },

        checkStrengthPass: function(password) {
            return this.REGEXP.strengthPass.test(password);
        },

        getElements: function() {
            let elems = this.$form.querySelectorAll('[data-validate-field]');
            this.elements = [];

            for (let i = 0, len = elems.length; i < len; ++i) {
                let item = elems[i],
                    name = item.getAttribute('data-validate-field'),
                    value = item.value,
                    isElemInGroup = false,
                    group = [];

                if (item.type === 'checkbox') {
                    value = item.checked || '';
                    item.addEventListener('change', (ev) => {
                        let elem = ev.target,
                            item = {
                                name: elem.getAttribute('data-validate-field'),
                                value: elem.checked,
                            };

                        delete this.result[item.name];
                        this.validateItem({
                            name: item.name,
                            value: item.value,
                            group: [],
                        });
                        this.renderErrors();
                    });
                }

                if (item.type === 'radio') {
                    const findElem = this.elements.filter((item) => {
                        if (item.name === name) {
                            return item;
                        }
                    })[0];

                    if (findElem) {
                        findElem.group.push(item.checked);
                        isElemInGroup = true;
                    } else {
                        group.push(item.checked);
                    }

                    item.addEventListener('change', (ev) => {
                        let elem = ev.target,
                            item = {
                                name: elem.getAttribute('data-validate-field'),
                                value: elem.checked,
                            };

                        delete this.result[item.name];
                        this.validateItem({
                            name: item.name,
                            value: item.value,
                            group: [],
                        });
                        this.renderErrors();
                    });
                }

                this.setterEventListener(
                    item,
                    'keyup',
                    this.handlerKeyup,
                    'add'
                );

                if (!isElemInGroup) {
                    this.elements.push({
                        name,
                        value,
                        group,
                    });
                }
            }

            this.validateElements();
        },

        /**
         * Validate Required field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateRequired: function(value) {
            return !this.isEmpty(value);
        },

        /**
         * Validate Email field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateEmail: function(value) {
            return this.isEmail(value);
        },

        /**
         * Validate Phone field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePhone: function(value) {
            return this.isPhone(value);
        },

        /**
         * Validate field for Min Length
         * @param {string} value Value for validate
         * @param {integer} min
         * @returns {boolean} True if validate is OK
         */
        validateMinLength: function(value, min) {
            return this.checkLengthMin(value, min);
        },

        /**
         * Validate field for Max Length
         * @param {string} value Value for validate
         * @param {integer} max
         * @returns {boolean} True if validate is OK
         */
        validateMaxLength: function(value, max) {
            return this.checkLengthMax(value, max);
        },

        /**
         * Validate field for strength password
         * @param {string} password Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateStrengthPass: function(password) {
            return this.checkStrengthPass(password);
        },

        /**
         * Validate Password field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePassword: function(value) {
            return this.isPassword(value);
        },

        /**
         * Validate ZIP field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateZip: function(value) {
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
        validateRemote: function({
            value,
            name,
            url,
            successAnswer,
            sendParam,
            method,
        }) {
            return new Promise((resolve) => {
                ajax({
                    url: url,
                    method: method,
                    data: {
                        [sendParam]: value,
                    },
                    async: true,
                    callback: (data) => {
                        if (
                            data.toLowerCase() === successAnswer.toLowerCase()
                        ) {
                            resolve('ok');
                        }
                        resolve({
                            type: 'incorrect',
                            name,
                        });
                    },
                    error: () => {
                        resolve({
                            type: 'error',
                            name,
                        });
                    },
                });
            });
        },

        generateMessage: function(rule, name, value) {
            let messages = this.messages || this.defaultMessages;
            let customMessage =
                (messages[name] && messages[name][rule]) ||
                (this.messages &&
                    typeof this.messages[name] === 'string' &&
                    messages[name]) ||
                // (messages[name][rule]) ||
                this.defaultMessages[rule] ||
                this.DEFAULT_REMOTE_ERROR;

            if (value) {
                customMessage = customMessage.replace(
                    ':value',
                    value.toString()
                );
            }
            this.result[name] = {
                message: customMessage,
            };
        },

        validateElements: function() {
            this.lockForm();
            this.elements.forEach((item) => {
                this.validateItem({
                    name: item.name,
                    value: item.value,
                    group: item.group,
                });
            });

            if (!this.promisesRemote.length) {
                this.renderErrors();
                return;
            }

            Promise.all(this.promisesRemote).then((resp) => {
                resp.forEach((result) => {
                    if (result === 'ok') {
                        this.renderErrors();
                        return;
                    }
                    if (result.type === 'error') {
                        alert('Server error occured. Please try later.');
                    }
                    this.generateMessage(RULE_REMOTE, result.name);
                    this.renderErrors();
                });
            });
        },

        validateItem: function({ name, group, value, isKeyupChange }) {
            let rules = this.rules[name] || this.defaultRules[name] || false;

            if (!rules) {
                return;
            }
            for (let rule in rules) {
                let ruleValue = rules[rule];

                if (
                    rule !== RULE_REQUIRED &&
                    rule !== RULE_FUNCTION &&
                    value == ''
                ) {
                    return;
                }
                switch (rule) {
                    case RULE_FUNCTION: {
                        if (typeof ruleValue !== 'function') {
                            break;
                        }
                        if (ruleValue(name, value)) {
                            break;
                        }
                        this.generateMessage(RULE_FUNCTION, name, ruleValue);
                        return;
                    }
                    case RULE_REQUIRED: {
                        if (!ruleValue) {
                            break;
                        }

                        if (group.length) {
                            let isSuccessValidateGroup = false;

                            // At least one item in group
                            group.forEach((item) => {
                                if (this.validateRequired(item)) {
                                    isSuccessValidateGroup = true;
                                }
                            });

                            if (isSuccessValidateGroup) {
                                break;
                            }
                        } else {
                            if (this.validateRequired(value)) {
                                break;
                            }
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
                        this.generateMessage(RULE_MINLENGTH, name, ruleValue);
                        return;
                    }

                    case RULE_MAXLENGTH: {
                        if (!ruleValue) {
                            break;
                        }
                        if (this.validateMaxLength(value, ruleValue)) {
                            break;
                        }
                        this.generateMessage(RULE_MAXLENGTH, name, ruleValue);
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

                    case RULE_STRENGTH: {
                        if (!ruleValue || typeof ruleValue !== 'object') {
                            break;
                        }

                        if (
                            ruleValue.default &&
                            this.validateStrengthPass(value)
                        ) {
                            break;
                        }

                        if (ruleValue.custom) {
                            let regexp;

                            try {
                                regexp = new RegExp(ruleValue.custom);
                            } catch (e) {
                                regexp = this.REGEXP.strengthPass;

                                // eslint-disable-next-line no-console
                                console.error(
                                    'Custom regexp for strength rule is not valid. Default regexp was used.'
                                );
                            }

                            if (regexp.test(value)) {
                                break;
                            }
                        }
                        this.generateMessage(RULE_STRENGTH, name);
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
                        if (isKeyupChange) {
                            break;
                        }

                        if (!ruleValue) {
                            break;
                        }

                        let url = ruleValue.url,
                            successAnswer = ruleValue.successAnswer,
                            method = ruleValue.method,
                            sendParam = ruleValue.sendParam;

                        let $elem = this.$form.querySelector(
                            `input[data-validate-field="${name}"]`
                        );
                        this.setterEventListener(
                            $elem,
                            'keyup',
                            this.handlerKeyup,
                            'remove'
                        );

                        this.promisesRemote.push(
                            this.validateRemote({
                                name,
                                value,
                                url,
                                method,
                                sendParam,
                                successAnswer,
                            })
                        );
                        return;
                    }
                }
            }
        },

        clearErrors: function() {
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

        renderErrors: function() {
            this.clearErrors();
            this.unlockForm();

            this.isValidationSuccess = false;
            if (Object.keys(this.result).length === 0) {
                this.isValidationSuccess = true;
                return;
            }

            for (let item in this.result) {
                let message = this.result[item].message;
                let $elems = this.$form.querySelectorAll(
                    `[data-validate-field="${item}"]`
                );

                let $elem = $elems[$elems.length - 1];

                let div = document.createElement('div');

                div.innerHTML = message;
                div.className = 'js-validate-error-label';
                div.setAttribute('style', `color: ${this.colorWrong}`);
                $elem.style.border = `1px solid ${this.colorWrong}`;
                $elem.style.color = `${this.colorWrong}`;
                $elem.classList.add('js-validate-error-field');

                if ($elem.type === 'checkbox' || $elem.type === 'radio') {
                    let $label = document.querySelector(
                        `label[for="${$elem.getAttribute('id')}"]`
                    );

                    if ($elem.parentNode.tagName.toLowerCase() === 'label') {
                        $elem.parentNode.parentNode.insertBefore(div, null);
                    } else if ($label) {
                        $label.parentNode.insertBefore(div, $label.nextSibling);
                    } else {
                        $elem.parentNode.insertBefore(div, $elem.nextSibling);
                    }
                } else {
                    $elem.parentNode.insertBefore(div, $elem.nextSibling);
                }
            }

            if (!this.tooltipSelectorWrap.length) {
                return;
            }

            this.state.tooltipsTimer = setTimeout(() => {
                this.hideTooltips();
            }, this.tooltipFadeOutTime);
        },

        hideTooltips: function() {
            let $elemsErrorLabel = document.querySelectorAll(
                '.js-validate-error-label'
            );

            $elemsErrorLabel.forEach((item) => {
                item.classList.add(this.tooltipFadeOutClass);
            });

            this.state.tooltipsTimer = null;
        },

        lockForm: function() {
            let $elems = this.$form.querySelectorAll(
                'input, textarea, button, select'
            );
            for (let i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].setAttribute('disabled', 'disabled');
                $elems[i].style.pointerEvents = 'none';
                $elems[i].style.webitFilter = 'grayscale(100%)';
                $elems[i].style.filter = 'grayscale(100%)';
            }
        },

        unlockForm: function() {
            let $elems = this.$form.querySelectorAll(
                'input, textarea, button, select'
            );
            for (let i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].removeAttribute('disabled');
                $elems[i].style.pointerEvents = '';
                $elems[i].style.webitFilter = '';
                $elems[i].style.filter = '';
            }
        },
    };

    window.JustValidate = JustValidate;
})(window);
