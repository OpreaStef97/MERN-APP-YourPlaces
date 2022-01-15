import { CSSProperties, FC } from 'react';
import ReactDOM from 'react-dom';
import Backdrop from '../UIElements/Backdrop';
import { CSSTransition } from 'react-transition-group';
import './Modal.css';

type PropsData = {
    contentClass?: string;
    style?: CSSProperties;
    headerClass?: string;
    header?: string;
    content?: string;
    footerClass?: string;
    footer?: JSX.Element;
    show: boolean;
    onSubmit?: () => void;
    onCancel?: (event: Event) => void;
};

const ModalOverlay: FC<PropsData> = props => {
    return ReactDOM.createPortal(
        <div className={`modal ${props.contentClass}`}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form
                onSubmit={
                    props.onSubmit
                        ? props.onSubmit
                        : event => event.preventDefault()
                }
            >
                <div className={`modal__content ${props.content}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>,
        document.getElementById('modal-hook')!
    );
};

const Modal: FC<PropsData> = props => {
    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames={'modal'}
            >
                <ModalOverlay {...props} />
            </CSSTransition>
        </>
    );
};

export default Modal;
