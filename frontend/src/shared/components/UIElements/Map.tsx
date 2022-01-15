import React, { CSSProperties, FC, useRef, useEffect } from 'react';

import './Map.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

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
