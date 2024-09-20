import { isEmail, isString, registerDecorator, ValidationOptions } from 'class-validator';


function validateEmailOrHandle(str: string) {
    if (isEmail(str) || (isString(str) && str.length >= 3)) {
        return true;
    }
    return false;
}

export function IsEmailOrHandle(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isEmailOrHandle',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && validateEmailOrHandle(value);
                },
            },
        });
    };
}
