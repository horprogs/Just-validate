describe("validate", function () {

    it("result", function () {
        let options = {
            rules: {
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
                password: {
                    minLength: 4,
                    maxLength: 8,
                    password: true,
                    required: true
                }
            },
            messages: {
                name: {
                    maxLength: 'SHORT',
                    minLength: '123'
                },
                email: {
                    required: 'Email required',
                    remote: 'API not check'
                }
            }
        };
        let expected = {
            email: {
                message: 'Not valid email'
            },
            name: {
                message: 'Too short'
            },
            password: {
                message: 'Field is required'
            },
        };

        let validate = new window.JSvalidation('.js-form', options);

        console.log(validate.result);

        assert.deepEqual(validate.result, expected);
    });

});

