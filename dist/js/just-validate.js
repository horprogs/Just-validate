'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
(function (root) {

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    }

    function Promise(fn) {
        if (_typeof(this) !== 'object') throw new TypeError('Promises must be constructed via new');
        if (typeof fn !== 'function') throw new TypeError('not a function');
        this._state = 0;
        this._handled = false;
        this._value = undefined;
        this._deferreds = [];

        doResolve(fn, this);
    }

    function handle(self, deferred) {
        while (self._state === 3) {
            self = self._value;
        }
        if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
        }
        self._handled = true;
        Promise._immediateFn(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                return;
            }
            var ret;
            try {
                ret = cb(self._value);
            } catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
            if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                } else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
        } catch (e) {
            reject(self, e);
        }
    }

    function reject(self, newValue) {
        self._state = 2;
        self._value = newValue;
        finale(self);
    }

    function finale(self) {
        if (self._state === 2 && self._deferreds.length === 0) {
            Promise._immediateFn(function () {
                if (!self._handled) {
                    Promise._unhandledRejectionFn(self._value);
                }
            });
        }

        for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                resolve(self, value);
            }, function (reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            });
        } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
        }
    }

    Promise.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var prom = new this.constructor(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    Promise.all = function (arr) {
        var args = Array.prototype.slice.call(arr);

        return new Promise(function (resolve, reject) {
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
                try {
                    if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }

            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    Promise.resolve = function (value) {
        if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Promise) {
            return value;
        }

        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.reject = function (value) {
        return new Promise(function (resolve, reject) {
            reject(value);
        });
    };

    Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    // Use polyfill for setImmediate for performance gains
    Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
        setImmediate(fn);
    } || function (fn) {
        setTimeoutFunc(fn, 0);
    };

    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }
    };

    /**
     * Set the immediate function to execute callbacks
     * @param fn {function} Function to execute
     * @deprecated
     */
    Promise._setImmediateFn = function _setImmediateFn(fn) {
        Promise._immediateFn = fn;
    };

    /**
     * Change the function to execute on unhandled rejection
     * @param {function} fn Function to execute on unhandled rejection
     * @deprecated
     */
    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
        Promise._unhandledRejectionFn = fn;
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Promise;
    } else if (!root.Promise) {
        root.Promise = Promise;
    }
})(window);

(function (window) {
    'use strict';

    if (!window.Promise) {
        window.Promise = Promise;
    }

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

    var JustValidate = function JustValidate(selector, options) {
        this.options = options || {};
        this.rules = this.options.rules || {};
        this.messages = this.options.messages || undefined;
        this.colorWrong = this.options.colorWrong || '#B81111';
        this.result = {};
        this.elements = [];
        this.bindHandlerKeyup = this.handlerKeyup.bind(this);
        this.submitHandler = this.options.submitHandler || undefined;
        this.promiseRemote = null;
        this.isValidationSuccess = false;
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

    JustValidate.prototype = {
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
            required: 'The field is required',
            email: 'Please, type a valid email',
            maxLength: 'The field must contain a maximum of :value characters',
            minLength: 'The field must contain a minimum of :value characters',
            password: 'Password is not valid',
            remote: 'Email already exists'
        },
        /**
         * Keyup handler
         * @param ev
         */
        handlerKeyup: function handlerKeyup(ev) {
            var elem = ev.target,
                item = {
                name: elem.getAttribute('data-validate-field'),
                value: elem.value
            };
            delete this.result[item.name];
            this.validateItem({
                name: item.name,
                value: item.value,
                isKeyupChange: true
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
        formPristine: function formPristine() {
            var $elems = this.$form.querySelectorAll('input, textarea');
            for (var i = 0, len = $elems.length; i < len; ++i) {
                if ($elems[i].type !== 'submit') {
                    $elems[i].value = '';
                }
            }
        },

        validationSuccess: function validationSuccess() {
            if (Object.keys(this.result).length === 0) {
                this.isValidationSuccess = false;
                if (this.submitHandler) {
                    this.submitHandler(this.$form, this.elements, ajax);
                    this.formPristine();
                    return;
                }

                this.$form.submit();
                this.formPristine();
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

                if (!_this.promiseRemote) {
                    if (_this.isValidationSuccess) {
                        _this.validationSuccess();
                    }
                    return;
                }

                _this.promiseRemote.then(function () {
                    _this.promiseRemote = null;
                    if (_this.isValidationSuccess) {
                        _this.validationSuccess();
                    }
                });
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
            var newVal = val;
            if (val.trim) {
                newVal = val.trim();
            }

            return !newVal;
        },

        checkLengthMax: function checkLengthMax(text, max) {
            return text.length <= max;
        },

        checkLengthMin: function checkLengthMin(text, min) {
            return text.length >= min;
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
            var value = _ref.value,
                name = _ref.name,
                url = _ref.url,
                successAnswer = _ref.successAnswer,
                sendParam = _ref.sendParam,
                method = _ref.method;

            return new Promise(function (resolve) {
                ajax({
                    url: url,
                    method: method,
                    data: _defineProperty({}, sendParam, value),
                    async: true,
                    callback: function callback(data) {
                        if (data.toLowerCase() === successAnswer.toLowerCase()) {
                            resolve('ok');
                        }
                        resolve({
                            type: 'incorrect',
                            name: name
                        });
                    },
                    error: function error() {
                        resolve({
                            type: 'error',
                            name: name
                        });
                    }
                });
            });
        },

        generateMessage: function generateMessage(rule, name, value) {
            var messages = this.messages || this.defaultMessages;
            var customMessage = messages[name] && messages[name][rule] || this.messages && typeof this.messages[name] === 'string' && messages[name] ||
            // (messages[name][rule]) ||
            this.defaultMessages[rule] || this.DEFAULT_REMOTE_ERROR;

            if (value) {
                customMessage = customMessage.replace(':value', value.toString());
            }
            this.result[name] = {
                message: customMessage
            };
        },

        validateElements: function validateElements() {
            var _this3 = this;

            this.lockForm();
            this.elements.forEach(function (item) {
                _this3.validateItem({
                    name: item.name,
                    value: item.value
                });
            });

            if (!this.promiseRemote) {
                this.renderErrors();
                return;
            }
            this.promiseRemote.then(function (result) {

                if (result === 'ok') {
                    _this3.renderErrors();
                    return;
                }
                if (result.type === 'error') {
                    alert('Server error occured. Please try later.');
                }
                _this3.generateMessage(RULE_REMOTE, result.name);
                _this3.renderErrors();
            });
        },

        validateItem: function validateItem(_ref2) {
            var name = _ref2.name,
                value = _ref2.value,
                isKeyupChange = _ref2.isKeyupChange;

            var rules = this.rules[name] || this.defaultRules[name] || false;

            if (!rules) {
                return;
            }
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
                            this.generateMessage(RULE_MINLENGTH, name, ruleValue);
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
                            this.generateMessage(RULE_MAXLENGTH, name, ruleValue);
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
                            if (isKeyupChange) {
                                break;
                            }

                            if (!ruleValue) {
                                break;
                            }

                            var url = ruleValue.url,
                                successAnswer = ruleValue.successAnswer,
                                method = ruleValue.method,
                                sendParam = ruleValue.sendParam;

                            var $elem = this.$form.querySelector('input[data-validate-field="' + name + '"]');
                            this.setterEventListener($elem, 'keyup', this.handlerKeyup, 'remove');
                            this.promiseRemote = this.validateRemote({ name: name, value: value, url: url, method: method, sendParam: sendParam, successAnswer: successAnswer });
                            // this.unlockForm();
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
            this.unlockForm();

            this.isValidationSuccess = false;
            if (Object.keys(this.result).length === 0) {
                this.isValidationSuccess = true;
                return;
            }

            for (var item in this.result) {
                var message = this.result[item].message;
                var $elems = this.$form.querySelectorAll('[data-validate-field="' + item + '"]');

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

        lockForm: function lockForm() {
            var $elems = this.$form.querySelectorAll('input, textarea, button, select');
            for (var i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].setAttribute('disabled', 'disabled');
                $elems[i].style.pointerEvents = 'none';
                $elems[i].style.webitFilter = 'grayscale(100%)';
                $elems[i].style.filter = 'grayscale(100%)';
            }
        },

        unlockForm: function unlockForm() {
            var $elems = this.$form.querySelectorAll('input, textarea, button, select');
            for (var i = 0, len = $elems.length; i < len; ++i) {
                $elems[i].removeAttribute('disabled');
                $elems[i].style.pointerEvents = '';
                $elems[i].style.webitFilter = '';
                $elems[i].style.filter = '';
            }
        }
    };

    window.JustValidate = JustValidate;
})(window);