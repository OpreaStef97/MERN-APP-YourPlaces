import React, { FC, useReducer, useEffect } from 'react';
import './Input.css';
import { validate, Validator } from '../../util/validators';

type Props = {
    id?: string;
    label?: string;
    element?: string;
    type?: string;
    placeholder?: string;
    rows?: number;
    validators?: Validator[];
    errorText?: string;
    initialValue?: string;
    initialValid?: boolean;
    onInput: (...args: any[]) => void;
};

type State = {
    isValid: boolean;
    isTouched: boolean;
    value?: string;
};

type Action = {
    type: string;
    val?: string;
    validators?: Validator[];
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val!, action.validators!),
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

const Input: FC<Props> = props => {
    const [inputState, dispatch] = useReducer(reducer, {
        value: props.initialValue || '',
        isTouched: false,
        isValid: props.initialValid || false,
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators,
        });
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH',
        });
    };

    const element =
        props.element === 'input' ? (
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        ) : (
            <textarea
                id={props.id}
                rows={props.rows || 3}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
            />
        );

    return (
        <div
            className={`form-control ${
                !inputState.isValid &&
                inputState.isTouched &&
                'form-control--invalid'
            }`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && (
                <p>{props.errorText}</p>
            )}
        </div>
    );
};

export default Input;
