import React, { FC, useContext, useState } from 'react';

import { useForm } from '../../shared/hooks/use-form';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/use-http';
import './Auth.css';

const Auth: FC = props => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const authCtx = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            const formStateObj = { ...formState.inputs };
            delete formStateObj.name;
            delete formStateObj.image;
            setFormData(
                formStateObj,
                !!formState.inputs.email?.isValid &&
                    !!formState.inputs.password?.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        if (isLoginMode) {
            sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                'POST',
                {
                    'Content-Type': 'application/json',
                },
                JSON.stringify({
                    email: formState.inputs.email?.value,
                    password: formState.inputs.password?.value,
                })
            )
                .then(res => {
                    authCtx.login(
                        res.token,
                    );
                })
                .catch(err => console.log(err.message));
        } else {
            const formDATA = new FormData();
            formDATA.append('email', formState.inputs.email!.value!);
            formDATA.append('name', formState.inputs.name!.value!);
            formDATA.append('password', formState.inputs.password!.value!);
            formDATA.append('image', formState.inputs.image!.value!);

            sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                'POST',
                {},
                formDATA
            )
                .then(res => {
                    authCtx.login(
                        res.token
                    );
                })
                .catch(err => console.log(err.message));
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[
                                VALIDATOR_REQUIRE(),
                                VALIDATOR_MAXLENGTH(15),
                            ]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload
                            center
                            id={'image'}
                            onInput={inputHandler}
                            errorText="Please provide an image"
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter valid email"
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password with at least 6 characters"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </>
    );
};

export default Auth;
