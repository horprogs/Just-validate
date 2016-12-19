describe('Validate rules', function () {

    describe('isEmail', function () {
        let validate = new window.JSvalidation('.js-form');

        it('test@test.com - correct', function () {
            assert.isTrue(validate.validateEmail('test@test.com'));
        });
        it('ivan@gmail.com - correct', function () {
            assert.isTrue(validate.validateEmail('ivan@gmail.com'));
        });
        it('ivangmail.com - wrong', function () {
            assert.isFalse(validate.validateEmail('ivangmail.com'));
        });
        it('ivan@gmailcom - wrong', function () {
            assert.isFalse(validate.validateEmail('ivan@gmailcom'));
        });
        it('ivan@ - wrong', function () {
            assert.isFalse(validate.validateEmail('ivan@'));
        });
    });

    describe('isZip', function () {
        let validate = new window.JSvalidation('.js-form');

        it('12345 - correct', function () {
            assert.isTrue(validate.validateZip('12345'));
        });
        it('55555 - correct', function () {
            assert.isTrue(validate.validateZip('55555'));
        });
    });

    describe('isPhone', function () {
        let validate = new window.JSvalidation('.js-form');

        it('12345 - correct', function () {
            assert.isTrue(validate.validatePhone('12345'));
        });
        it('55555 - correct', function () {
            assert.isTrue(validate.validatePhone('55555'));
        });
    });

    describe('isPassword', function () {
        let validate = new window.JSvalidation('.js-form');

        it('12345f - correct', function () {
            assert.isTrue(validate.validatePassword('12345f'));
        });
        it('55555 - wrong', function () {
            assert.isFalse(validate.validatePassword('55555'));
        });
    });

    describe('isMinLength', function () {
        let validate = new window.JSvalidation('.js-form');

        it('1111 (length 3) - correct', function () {
            assert.isTrue(validate.validateMinLength('1111', 3));
        });
        it('1234 (length 5) - wrong', function () {
            assert.isFalse(validate.validateMinLength('1234', 5));
        });
    });

    describe('isMaxLength', function () {
        let validate = new window.JSvalidation('.js-form');

        it('123456 (length 8) - correct', function () {
            assert.isTrue(validate.validateMaxLength('123456', 8));
        });
        it('123456 (length 5) - wrong', function () {
            assert.isFalse(validate.validateMaxLength('123456', 5));
        });
    });

    describe('Expected messages', function () {
        it('example1', function () {
            let options = {
                rules: {
                    email: {
                        required: true,
                        email: true,
                        remote: ['http://localhost:7777/check-correct', 'OK']
                    },
                    name: {
                        required: true,
                        minLength: 3,
                        maxLength: 15
                    },
                    password: {
                        required: true,
                        password: true,
                        minLength: 4,
                        maxLength: 8,
                    }
                },
                messages: {
                    name: {
                        maxLength: 'LONG',
                        minLength: 'SHORT'
                    },
                    email: {
                        required: 'Email required',
                        remote: 'API not check'
                    }
                }
            };
            let expected = {
                email: {
                    message: 'Email required'
                },
                name: {
                    message: 'SHORT'
                },
                password: {
                    message: 'Password is not valid'
                },
            };

            let validate = new window.JSvalidation('.js-form', options);
            console.log(validate.result);
            assert.deepEqual(validate.result, expected);
        });

        it('example2', function () {
            let options = {
                rules: {
                    email: {
                        required: true,
                        email: true,
                        remote: ['http://localhost:7777/check-correct', 'OK']
                    },
                    name: {
                        required: true,
                        minLength: 3,
                        maxLength: 15
                    },
                    password: {
                        required: true,
                        password: true,
                        minLength: 4,
                        maxLength: 8,
                    }
                }
            };
            let expected = {
                email: {
                    message: 'Field is required'
                },
                name: {
                    message: 'Too short'
                },
                password: {
                    message: 'Password is not valid'
                },
            };

            let validate = new window.JSvalidation('.js-form', options);
            console.log(validate.result)
            assert.deepEqual(validate.result, expected);
        });
    });
});

