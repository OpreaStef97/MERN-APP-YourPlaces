import { ChangeEvent, FC, useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload: FC<{
    id: string;
    center?: boolean;
    onInput: (...args: any[]) => void;
    errorText?: string;
}> = props => {
    const [file, setFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string>();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (typeof fileReader.result === 'string')
                setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    interface HTMLInputEvent extends ChangeEvent {
        target: HTMLInputElement & EventTarget;
    }

    const pickedHandler = (event: HTMLInputEvent) => {
        let pickedFile;
        let fileIsValid = isValid;

        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true; // because isValid not updates immediately
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current!.click();
    };

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center ? 'center' : ''}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    PICK IMAGE
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
