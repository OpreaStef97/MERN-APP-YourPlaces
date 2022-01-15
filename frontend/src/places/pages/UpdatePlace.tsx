import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/use-form';
import { useHttpClient } from '../../shared/hooks/use-http';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { PlaceData } from '../types/place-data';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState<PlaceData>();
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const { placeId } = useParams();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: true,
            },
            description: {
                value: '',
                isValid: true,
            },
        },
        true
    );

    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
            .then(res => {
                setLoadedPlace(res.data.place);
                setFormData(
                    {
                        title: {
                            value: res.data.place?.title,
                            isValid: true,
                        },
                        description: {
                            value: res.data.place?.description,
                            isValid: true,
                        },
                    },
                    true
                );
            })
            .catch(err => console.log(err.message));
    }, [sendRequest, placeId, setFormData]);

    const placeUpdateSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
            'PATCH',
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authCtx.token,
            },
            JSON.stringify({
                title: formState.inputs.title?.value,
                description: formState.inputs.description?.value,
            })
        )
            .then(() => {
                navigate(`/${authCtx.userId}/places`, {
                    replace: true,
                });
            })
            .catch(err => console.log(err.message));
    };

    if (isLoading) {
        return (
            <div className="center">
                <Card>
                    <LoadingSpinner />
                </Card>
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form
                    className="place-form"
                    onSubmit={placeUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title"
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        type="text"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
            )}
        </>
    );
};

export default UpdatePlace;
