import React from 'react';
import { Modal } from "@fluentui/react";
import { SearchControl, OpenStreetMapProvider,  } from 'react-leaflet-geosearch';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// import './example/react-leaflet-geosearch.css';

const MapModal = () => {

  const prov = OpenStreetMapProvider();
  const GeoSearchControlElement = SearchControl;

  return (
    <Modal
      isOpen
      containerClassName="map-modal"
      styles={{
        main: {
          height: '500px',
          width: '500px',
        }
      }}
    >
      <MapContainer center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoSearchControlElement
          provider={prov}
          showMarker={true}
          showPopup={true}
          maxMarkers={3}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={false}
          searchLabel={"Enter address, please"}
          keepResult={true}
          popupFormat={({ query, result }) => result.label}
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
    </MapContainer>
    </Modal>
  )
}

export default MapModal;
