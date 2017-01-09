'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
    var typesToPatch = ['DocumentType', 'Element', 'CharacterData'],
        remove = function remove() {
        // The check here seems pointless, since we're not adding this
        // method to the prototypes of any any elements that CAN be the
        // root of the DOM. However, it's required by spec (see point 1 of
        // https://dom.spec.whatwg.org/#dom-childnode-remove) and would
        // theoretically make a difference if somebody .apply()ed this
        // method to the DOM's root node, so let's roll with it.
        if (this.parentNode != null) {
            this.parentNode.removeChild(this);
        }
    };

    for (var i = 0; i < typesToPatch.length; i++) {
        var type = typesToPatch[i];
        if (window[type] && !window[type].prototype.remove) {
            window[type].prototype.remove = remove;
        }
    }
})();
(function (window) {
    'use strict';

    var RULE_REQUIRED = 'required',
        RULE_EMAIL = 'email',
        RULE_MINLENGTH = 'minLength',
        RULE_MAXLENGTH = 'maxLength',
        RULE_PASSWORD = 'password',
        RULE_ZIP = 'zip',
        RULE_PHONE = 'phone',
        RULE_REMOTE = 'remote';

    var formatParams = function formatParams(params, method) {
        if (typeof params === 'string') {
            return params;
        }

        var letter = method.toLowerCase() === 'post' ? '' : '?';
        if (Array.isArray(params)) {
            return letter + params.map(function (obj) {
                return obj.name + "=" + obj.value;
            }).join("&");
        }
        return letter + Object.keys(params).map(function (key) {
            return key + "=" + params[key];
        }).join("&");
    };

    var ajax = function ajax(options) {
        var url = options.url,
            method = options.method,
            data = options.data,
            debug = options.debug,
            callback = options.callback,
            error = options.error;

        if (debug) {
            callback('test');
            return;
        }

        var async = options.async === false ? false : true;
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
                } else {
                    error(this.responseText);
                }
            }
        };
        xhr.send(body);
    };

    var JSvalidation = function JSvalidation(selector, options) {
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

        handlerKeyup: function handlerKeyup(ev) {
            var elem = ev.target,
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

        setterEventListener: function setterEventListener(item, event, handler, type) {
            if (event === 'keyup') {
                handler = this.bindHandlerKeyup;
            }
            switch (type) {
                case 'add':
                    {
                        item.addEventListener(event, handler);
                        break;
                    }
                case 'remove':
                    {
                        item.removeEventListener(event, handler);
                        break;
                    }
            }
        },

        setForm: function setForm(form) {
            var _this = this;

            this.$form = form;
            this.$form.setAttribute('novalidate', 'novalidate');
            this.$form.addEventListener('submit', function (ev) {
                ev.preventDefault();
                _this.result = [];
                _this.getElements();

                if (Object.keys(_this.result).length === 0) {
                    // this._blockSubmitBtn();
                    if (_this.submitHandler) {
                        _this.submitHandler(_this.$form, _this.elements, ajax);
                        return;
                    }

                    _this.$form.submit();
                    return;
                }
            });
        },

        isEmail: function isEmail(email) {
            return this.REGEXP.email.test(email);
        },

        isZip: function isZip(zip) {
            return this.REGEXP.zip.test(zip);
        },

        isPhone: function isPhone(phone) {
            return this.REGEXP.phone.test(phone);
        },

        isPassword: function isPassword(password) {
            return this.REGEXP.password.test(password);
        },

        isEmpty: function isEmpty(val) {
            return !val;
        },

        checkLengthMax: function checkLengthMax(text, max) {
            return text.length <= max;
        },

        checkLengthMin: function checkLengthMin(text, min) {
            return text.length > min;
        },

        getElements: function getElements() {
            var _this2 = this;

            var elems = this.$form.querySelectorAll('[data-validate-field]');
            this.elements = [];

            for (var i = 0, len = elems.length; i < len; ++i) {
                var item = elems[i],
                    name = item.getAttribute('data-validate-field'),
                    value = item.value;

                if (item.type === 'checkbox') {
                    value = item.checked || '';

                    item.addEventListener('change', function (ev) {
                        var elem = ev.target,
                            item = {
                            name: elem.getAttribute('data-validate-field'),
                            value: elem.checked
                        };

                        delete _this2.result[item.name];
                        _this2.validateItem({
                            name: item.name,
                            value: item.value
                        });
                        _this2.renderErrors();
                    });
                }
                this.setterEventListener(item, 'keyup', this.handlerKeyup, 'add');
                // let bindFunc = this.handlerKeyup.bind(this)
                // item.addEventListener('keyup', bindFunc, false);

                this.elements.push({
                    name: name,
                    value: value
                });
            }

            this.validateElements();
        },

        /**
         * Validate Required field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateRequired: function validateRequired(value) {
            return !this.isEmpty(value);
        },

        /**
         * Validate Email field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateEmail: function validateEmail(value) {
            return this.isEmail(value);
        },

        /**
         * Validate Phone field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePhone: function validatePhone(value) {
            return this.isPhone(value);
        },

        /**
         * Validate field for Min Length
         * @param {string} value Value for validate
         * @param {integer} min
         * @returns {boolean} True if validate is OK
         */
        validateMinLength: function validateMinLength(value, min) {
            return this.checkLengthMin(value, min);
        },

        /**
         * Validate field for Max Length
         * @param {string} value Value for validate
         * @param {integer} max
         * @returns {boolean} True if validate is OK
         */
        validateMaxLength: function validateMaxLength(value, max) {
            return this.checkLengthMax(value, max);
        },

        /**
         * Validate Password field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validatePassword: function validatePassword(value) {
            return this.isPassword(value);
        },

        /**
         * Validate ZIP field
         * @param {string} value Value for validate
         * @returns {boolean} True if validate is OK
         */
        validateZip: function validateZip(value) {
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
        validateRemote: function validateRemote(_ref) {
            var _this3 = this;

            var value = _ref.value,
                name = _ref.name,
                url = _ref.url,
                successAnswer = _ref.successAnswer,
                sendParam = _ref.sendParam,
                method = _ref.method;

            ajax({
                url: url,
                method: method,
                data: _defineProperty({}, sendParam, value),
                async: false,
                callback: function callback(data) {
                    if (data !== successAnswer) {
                        _this3.generateMessage(RULE_REMOTE, name);
                        _this3.renderErrors();
                    }
                }
            });
        },

        generateMessage: function generateMessage(rule, name) {
            var messages = this.messages || this.defaultMessages;
            //console.log('MESSAGES', this.defaultMessages)
            //console.log('RULE', rule)
            //console.log('MSG', messages[name])
            var customMessage = messages[name] && messages[name][rule] || this.messages && typeof this.messages[name] === 'string' && messages[name] ||
            // (messages[name][rule]) ||
            this.defaultMessages[rule] || this.DEFAULT_REMOTE_ERROR;

            this.result[name] = {
                message: customMessage
            };
        },

        // clearMessage: function (rule, name) {
        //     this.result[name] = {
        //         message: customMessage
        //     };
        // },

        validateElements: function validateElements() {
            var _this4 = this;

            this.elements.forEach(function (item) {
                _this4.validateItem({
                    name: item.name,
                    value: item.value
                });
            });

            this.renderErrors();
        },

        validateItem: function validateItem(_ref2) {
            var name = _ref2.name,
                value = _ref2.value;

            var rules = this.rules[name] || this.defaultRules[name] || false;

            if (!rules) {
                return;
            }
            //console.log('rules', rules)
            for (var rule in rules) {
                var ruleValue = rules[rule];
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

                            var url = ruleValue.url,
                                successAnswer = ruleValue.successAnswer,
                                method = ruleValue.method,
                                sendParam = ruleValue.sendParam;

                            var $elem = this.$form.querySelector('input[data-validate-field="' + name + '"]');
                            this.setterEventListener($elem, 'keyup', this.handlerKeyup, 'remove');
                            this.validateRemote({ name: name, value: value, url: url, method: method, sendParam: sendParam, successAnswer: successAnswer });
                            // this._unblockSubmitBtn();
                            return;
                        }
                }
            }
        },

        clearErrors: function clearErrors() {
            var $elems = document.querySelectorAll('.js-validate-error-label');
            for (var i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].remove();
            }

            $elems = document.querySelectorAll('.js-validate-error-field');
            for (var _i = 0, _len = $elems.length; _i < _len; ++_i) {
                $elems[_i].classList.remove('js-validate-error-field');
                $elems[_i].style.border = '';
                $elems[_i].style.color = '';
            }
        },

        renderErrors: function renderErrors() {
            this.clearErrors();

            if (Object.keys(this.result).length === 0) {
                this._unblockSubmitBtn();
                return;
            }

            // this._blockSubmitBtn();

            for (var item in this.result) {
                var message = this.result[item].message;
                var $elems = this.$form.querySelectorAll('[data-validate-field="' + item + '"');

                for (var i = 0, len = $elems.length; i < len; ++i) {
                    var div = document.createElement('div'),
                        _item = $elems[i];

                    div.innerHTML = message;
                    div.className = 'js-validate-error-label';
                    div.setAttribute('style', 'color: ' + this.colorWrong);
                    _item.style.border = '1px solid ' + this.colorWrong;
                    _item.style.color = '' + this.colorWrong;
                    _item.classList.add('js-validate-error-field');

                    if (_item.type === 'checkbox') {
                        var $label = document.querySelector('label[for="' + _item.getAttribute('id') + '"]');

                        if (_item.parentNode.tagName.toLowerCase() === 'label') {
                            _item.parentNode.parentNode.insertBefore(div, null);
                        } else if ($label) {
                            $label.parentNode.insertBefore(div, $label.nextSibling);
                        } else {
                            _item.parentNode.insertBefore(div, _item.nextSibling);
                        }
                        continue;
                    }

                    _item.parentNode.insertBefore(div, _item.nextSibling);
                }
            }
        },

        _blockSubmitBtn: function _blockSubmitBtn() {
            var submitBtn = this.$form.querySelector('input[type="submit"]') || this.$form.querySelector('button');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.webitFilter = 'grayscale(100%)';
            submitBtn.style.filter = 'grayscale(100%)';
            submitBtn.setAttribute('disabled', 'disabled');
        },

        _unblockSubmitBtn: function _unblockSubmitBtn() {
            var submitBtn = this.$form.querySelector('input[type="submit"]') || this.$form.querySelector('button');
            submitBtn.style.pointerEvents = '';
            submitBtn.style.webitFilter = '';
            submitBtn.style.filter = '';
            submitBtn.removeAttribute('disabled');
        }
    };

    window.JSvalidation = JSvalidation;
})(window);