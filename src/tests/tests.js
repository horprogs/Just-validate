describe('validate', function () {

    // it('isEmail', function () {
    //     let options = {
    //         rules: {
    //             email: {
    //                 required: true,
    //                 email: true,
    //                 remote: ['http://localhost:7777/check-correct', 'OK']
    //             },
    //             name: {
    //                 required: true,
    //                 minLength: 3,
    //                 maxLength: 15
    //             },
    //             password: {
    //                 required: true,
    //                 minLength: 4,
    //                 maxLength: 8,
    //                 password: true
    //             }
    //         },
    //         messages: {
    //             name: {
    //                 maxLength: 'LONG',
    //                 minLength: 'SHORT'
    //             },
    //             email: {
    //                 required: 'Email required',
    //                 remote: 'API not check'
    //             }
    //         }
    //     };
    //     let validate = new window.JSvalidation('.js-form', options);
    //     console.log(validate.result)
    //     console.log('123')
    //     // assert.isTrue(validate.isEmail('test@test.com'));
    // });

    it('result', function () {
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
                    minLength: 4,
                    maxLength: 8,
                    password: true
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
                message: 'Not valid email'
            },
            name: {
                message: 'SHORT'
            },
            password: {
                message: 'Field is required'
            },
        };

        let validate = new window.JSvalidation('.js-form');

        console.log(validate.result);

        // assert.deepEqual(validate.result, expected);
    });

});

