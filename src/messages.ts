import { Rules } from './interfaces';

export const getDefaultMessage = (rule?: Rules, ruleValue?: number) => {
    switch (rule) {
        case Rules.Required:
            return 'The field is required';

        case Rules.Email:
            return 'Please, type a valid email';

        case Rules.MaxLength:
            return 'The field must contain a maximum of :value characters'.replace(
                ':value',
                String(ruleValue!)
            );

        case Rules.MinLength:
            return 'The field must contain a minimum of :value characters'.replace(
                ':value',
                String(ruleValue!)
            );

        case Rules.Password:
            return 'Password is not valid';

        case Rules.Strength:
            return 'Password must contents at least one uppercase letter, one lowercase letter and one number';

        default:
            return 'Value is incorrect';
    }
};
