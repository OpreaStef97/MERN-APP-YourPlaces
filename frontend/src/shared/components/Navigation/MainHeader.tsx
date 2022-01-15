import { FC } from 'react';
import './MainHeader.css';

const MainHeader: FC = props => {
    return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
