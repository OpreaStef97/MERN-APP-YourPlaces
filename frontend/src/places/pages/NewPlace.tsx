import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/util/validators';

import { useNavigate } from 'react-router-dom';
import { useForm } from '../../shared/hooks/use-form';
import { useHttpClient } from '../../shared/hooks/use-http';
import { useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';

const NewPlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const authCtx = useContext(AuthContext);

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
            address: {
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

    const navigate = useNavigate();

    const placeSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', formState.inputs.title!.value!);
        formData.append('description', formState.inputs.description!.value!);
        formData.append('address', formState.inputs.address!.value!);
        formData.append('image', formState.inputs.image!.value!);

        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places`,
            'POST',
            {
                Authorization: 'Bearer ' + authCtx.token,
            },
            formData
        )
            .then(() => {
                navigate('/', {
                    replace: true,
                });
            })
            .catch(err => console.log(err.message));
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter valid title"
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    type="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)"
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    type="textarea"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image"
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </>
    );
};
export default NewPlace;
