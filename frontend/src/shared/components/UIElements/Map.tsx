import React, { CSSProperties, FC, useRef, useEffect } from 'react';

import './Map.css';

type PropsData = {
    className?: string;
    style?: CSSProperties;
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
};

const Map: FC<PropsData> = props => {
    const mapRef = useRef<HTMLDivElement>(null);

    const { center, zoom } = props;

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current!, {
            center: center,
            zoom: zoom,
        });
        new window.google.maps.Marker({ position: center, map: map });
    }, [center, zoom]);

    return <div className={`map ${props.className}`} ref={mapRef}></div>;
};

export default Map;
