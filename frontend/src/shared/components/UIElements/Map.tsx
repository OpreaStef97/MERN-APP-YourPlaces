import React, { CSSProperties, FC, useRef, useEffect } from 'react';

import './Map.css';

import 'mapbox-gl/dist/mapbox-gl.css';
// eslint-disable-next-line import/no-webpack-loader-syntax

// added the following 6 lines.
import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN!;

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
        const map = new mapboxgl.Map({
            container: mapRef.current!, // HTML container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [center.lng, center.lat], // starting position [lng, lat]
            zoom: zoom, // starting zoom
        });
        new mapboxgl.Marker({
            color: '#ff0055',
            draggable: false,
        })
            .setLngLat([center.lng, center.lat])
            .addTo(map);
    }, [center, zoom]);

    return <div className={`map ${props.className}`} ref={mapRef}></div>;
};

export default Map;
