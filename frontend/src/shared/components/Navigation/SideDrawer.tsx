import ReactDOM from 'react-dom';
import { FC } from 'react';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer: FC<{ show: boolean; onClick?: () => void }> = props => {
    const content = (
        <CSSTransition
            in={props.show}
            timeout={200}
            classNames="slide-in-left"
            mountOnEnter
            unmountOnExit
        >
            <aside className="side-drawer">{props.children}</aside>
        </CSSTransition>
    );

    return ReactDOM.createPortal(
        content,
        document.getElementById('drawer-hook')!
    );
};

export default SideDrawer;
