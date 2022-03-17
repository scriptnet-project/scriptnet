import React from 'react';
import { Modal } from "@fluentui/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const MapModal = () => {

  return (
    <Modal
      isOpen={true}
      isBlocking={true}
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
