(function (window) {
    'use strict';

    const JSvalidation = function (selector, opt) {
        this.$form = document.querySelector(selector);
        this.REGEXP = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            zip: /^\d{5}(-\d{4})?$/,
            phone: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
            password: /^(?=.*\d).{0,}$/
        };
        console.log(this.isPassword('fdd1dfs'));
    };

    JSvalidation.prototype = {
        defaults: {
            email: {
                required: true,
                email: true
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
                required: true
            },
            phone: {
                phone: true
            }
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

        checkLengthMax: function (text, max) {
            return text.length < max;
        }


    };

    window.JSvalidation = JSvalidation;
}(window));

new window.JSvalidation('.js-form');
