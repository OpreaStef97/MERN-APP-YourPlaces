const VALIDATOR_TYPE_REQUIRE = 'REQUIRE';
const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_MAXLENGTH = 'MAXLENGTH';
const VALIDATOR_TYPE_MIN = 'MIN';
const VALIDATOR_TYPE_MAX = 'MAX';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';
const VALIDATOR_TYPE_FILE = 'FILE';

export type Validator = {
    type: string;
    val?: number | string;
};
export const VALIDATOR_REQUIRE = () =>
    ({ type: VALIDATOR_TYPE_REQUIRE } as Validator);

export const VALIDATOR_FILE = () =>
    ({ type: VALIDATOR_TYPE_FILE } as Validator);

export const VALIDATOR_MINLENGTH = (val: number | string) =>
    ({
        type: VALIDATOR_TYPE_MINLENGTH,
        val: val,
    } as Validator);

export const VALIDATOR_MAXLENGTH = (val: number | string) =>
    ({
        type: VALIDATOR_TYPE_MAXLENGTH,
        val: val,
    } as Validator);

export const VALIDATOR_MIN = (val: number | string) =>
    ({
        type: VALIDATOR_TYPE_MIN,
        val: val,
    } as Validator);

export const VALIDATOR_MAX = (val: number | string) =>
    ({
        type: VALIDATOR_TYPE_MAX,
        val: val,
    } as Validator);

export const VALIDATOR_EMAIL = () =>
    ({ type: VALIDATOR_TYPE_EMAIL } as Validator);

export const validate = (value: string, validators: Validator[]) => {
    let isValid = true;
    for (const validator of validators) {
        if (validator.type === VALIDATOR_TYPE_REQUIRE) {
            isValid = isValid && value.trim().length > 0;
        }
        if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
            isValid =
                isValid &&
                !!validator.val &&
                value.trim().length >= validator.val;
        }
        if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
            isValid =
                isValid &&
                !!validator.val &&
                value.trim().length <= validator.val;
        }
        if (validator.type === VALIDATOR_TYPE_MIN) {
            isValid = isValid && !!validator.val && +value >= validator.val;
        }
        if (validator.type === VALIDATOR_TYPE_MAX) {
            isValid = isValid && !!validator.val && +value <= validator.val;
        }
        if (validator.type === VALIDATOR_TYPE_EMAIL) {
            isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
        }
    }
    return isValid;
};
