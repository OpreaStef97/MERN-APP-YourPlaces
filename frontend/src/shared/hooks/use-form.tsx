import { useCallback, useReducer } from 'react';

type InputType = {
    [key: string]:
        | {
              value: string | File | null;
              isValid: boolean;
          }
        | undefined;
};

type State = {
    isValid: boolean;
    inputs: InputType;
};

type Action = {
    type: string;
    [key: string]: any;
};

const initialState: State = {
    isValid: false,
    inputs: {},
};

const formReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            // console.log(action);
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    // if one of the inputs is invalid, then the entire form is invalid
                    formIsValid = formIsValid && action.isValid;
                } else {
                    // title.isValid || description.isValid might be false so we update formIsValid boolean state accordingly
                    formIsValid =
                        formIsValid && !!state.inputs[inputId]?.isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid,
                    },
                },
                isValid: formIsValid,
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid,
            };
        default:
            return initialState;
    }
};

type ReturnType = [
    State,
    (id: any, value: any, isValid: any) => void,
    (inputData: InputType, formValidity: boolean) => void
];

export const useForm = (
    initialInputs: InputType,
    initialFormValidity: boolean
): ReturnType => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    // using useCallback makes a memoized version of inputhHandler function, so we avoid an infinite loop,\
    // when we call it with useEffect
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value,
            isValid,
            inputId: id,
        });
    }, []);

    const setFormData = useCallback(
        (inputData: InputType, formValidity: boolean) => {
            dispatch({
                type: 'SET_DATA',
                inputs: inputData,
                formIsValid: formValidity,
            });
        },
        []
    );

    return [formState, inputHandler, setFormData];
};
