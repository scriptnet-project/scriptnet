import { useEffect, useRef, useState } from 'react';
import { DefaultButton, getTheme, IconButton, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles, PrimaryButton } from "@fluentui/react";
import { SearchControl, OpenStreetMapProvider,  } from 'react-leaflet-geosearch';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useField } from 'formik';


function LocationMarker() {
  const [position, setPosition] = useState([53.3498, -6.2603])
  const map = useMapEvents({
    click(e) {
      console.log('click', e);
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
      // map.locate()
    },
    locationfound(e) {
      console.log('locationfound', e);
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
    >
      <Popup>You are here</Popup>
    </Marker>
  )
}

const MapModal = ({ onClose, initialValue, setValue }) => {
  const theme = getTheme();

  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([53.3498, -6.2603]);
  const provider = OpenStreetMapProvider();
  const GeoSearchControlElement = SearchControl;
  const [location, setLocation] = useState(initialValue || null);

  useEffect(() => {

  }, [location])

  const handleSearch = async (value: string) => {
    const results = await provider.search({ query: value });
    console.log(results);
  }

  const moveMarker = (e) => {
    console.log(e);
  }

  return (
    <Modal
      isOpen
      onDismissed={onClose}
      styles={{ main: { width: '500px', height: '500px' } }}
    >
      <Stack>
        <SearchBox onSearch={handleSearch} />
      </Stack>
    </Modal>
  )
}

const LocationSelector = ({ label, ...props }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(props.field.name);

  const style = {
    map: {
      height: '400px',
      width: '100%'
    }
  }

  return (
    <Stack
      horizontal
    >
      <MapContainer
        center={[53.3498, -6.2603]}
        zoom={13}
        style={style.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </Stack>
  )
}

export default LocationSelector;
