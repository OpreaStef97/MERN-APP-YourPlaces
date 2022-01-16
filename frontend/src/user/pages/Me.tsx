import { FC, FormEvent, useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/use-form';
import { useHttpClient } from '../../shared/hooks/use-http';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './Me.css';

const Me: FC = () => {
    const authCtx = useContext(AuthContext);
    const [success, setSuccess] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            oldpassword: {
                value: '',
                isValid: false,
            },
            newpassword: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const changePasswordSubmitHandler = (event: FormEvent) => {
        event.preventDefault();

        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/changepassword`,
            'POST',
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authCtx.token,
            },
            JSON.stringify({
                email: formState.inputs.email!.value!,
                oldpassword: formState.inputs.oldpassword!.value!,
                newpassword: formState.inputs.newpassword!.value!,
            })
        )
            .then(() => {
                setSuccess(true);
            })
            .catch(err => console.log(err));
    };

    const closeModal = () => {
        setSuccess(false);
    };

    return (
        <div className="center">
            <Modal
                show={success}
                onCancel={closeModal}
                footer={<Button onClick={closeModal}>CLOSE</Button>}
            >
                Password Changed!
            </Modal>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="me">
                <p className="me__msg">
                    Welcome {authCtx.name?.split(' ')[0]}!
                </p>
                <p className="me__pass">Change Password</p>
                <hr />
                <form onSubmit={changePasswordSubmitHandler}>
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email"
                        onInput={inputHandler}
                        initialValid={true}
                        initialValue={authCtx.email!}
                    />
                    <Input
                        id="oldpassword"
                        element="input"
                        type="password"
                        label="Old Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password with at least 6 characters"
                        onInput={inputHandler}
                    />
                    <Input
                        id="newpassword"
                        element="input"
                        type="password"
                        label="New Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password with at least 6 characters"
                        onInput={inputHandler}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoading && 'Loading..'}
                        {!isLoading && 'Change Password'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Me;
