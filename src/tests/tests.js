describe('Validate rules', function () {

    describe('isEmail', function () {
        let validate = new window.JustValidate('.js-form');

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
        let validate = new window.JustValidate('.js-form');

        it('12345 - correct', function () {
            assert.isTrue(validate.validateZip('12345'));
        });
        it('55555 - correct', function () {
            assert.isTrue(validate.validateZip('55555'));
        });
        it('12345678 - wrong', function () {
            assert.isFalse(validate.validateZip('12345678'));
        });
        it('fdsdf - wrong', function () {
            assert.isFalse(validate.validateZip('fdsdf'));
        });
    });

    describe('isPhone', function () {
        let validate = new window.JustValidate('.js-form');

        it('111-222-3333 - correct', function () {
            assert.isTrue(validate.validatePhone('111-222-3333'));
        });
        it('55555 - wrong', function () {
            assert.isFalse(validate.validatePhone('55555'));
        });
    });

    describe('isPassword', function () {
        let validate = new window.JustValidate('.js-form');

        it('12345f - correct', function () {
            assert.isTrue(validate.validatePassword('12345f'));
        });
        it('sdfgs1 - correct', function () {
            assert.isTrue(validate.validatePassword('sdfgs1'));
        });
        it('55555 - wrong', function () {
            assert.isFalse(validate.validatePassword('55555'));
        });
        it('dsgsdf - wrong', function () {
            assert.isFalse(validate.validatePassword('dsgsdf'));
        });
    });

    describe('isMinLength', function () {
        let validate = new window.JustValidate('.js-form');

        it('1111 (length 3) - correct', function () {
            assert.isTrue(validate.validateMinLength('1111', 3));
        });
        it('1234 (length 5) - wrong', function () {
            assert.isFalse(validate.validateMinLength('1234', 5));
        });
    });

    describe('isMaxLength', function () {
        let validate = new window.JustValidate('.js-form');

        it('123456 (length 8) - correct', function () {
            assert.isTrue(validate.validateMaxLength('123456', 8));
        });
        it('123456 (length 5) - wrong', function () {
            assert.isFalse(validate.validateMaxLength('123456', 5));
        });
    });
});

