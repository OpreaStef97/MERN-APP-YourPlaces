import { FC, useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/use-form';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './Me.css';

const Me: FC = () => {
    const authCtx = useContext(AuthContext);

    const [formState, inputHandler] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            'old-password': {
                value: '',
                isValid: false,
            },
            'new-password': {
                value: '',
                isValid: false,
            },
        },
        false
    );

    return (
        <div className="center">
            <Card className="me">
                <p className="me__msg">
                    Welcome {authCtx.name?.split(' ')[0]}!
                </p>
                <p className="me__pass">Change Password</p>
                <hr />
                <form>
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email"
                        onInput={inputHandler}
                        initialValid={true}
                    />
                    <Input
                        id="old-password"
                        element="input"
                        type="password"
                        label="Old Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password with at least 6 characters"
                        onInput={inputHandler}
                    />
                    <Input
                        id="new-password"
                        element="input"
                        type="password"
                        label="New Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password with at least 6 characters"
                        onInput={inputHandler}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        Change Password
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Me;
