import { useEffect, useRef, useState, useMemo } from 'react';
import { get } from 'lodash';
import { Text, DefaultButton, getTheme, IconButton, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles, PrimaryButton, Icon, Link, useTheme, BaseButton, FontIcon } from "@fluentui/react";
import { OpenStreetMapProvider  } from 'react-leaflet-geosearch';
import { GeoSearchControl } from 'leaflet-geosearch';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { useField } from 'formik';
import { searchReverseLocation } from '@/utils/searchReverseLocation';

const SearchControl = ({ onSelectResult }) => {
  const map = useMap();

  const provider = OpenStreetMapProvider();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: provider,
      // style: 'bar',
      showMarker: false,
      autoClose: true,
      keepResult: true,
      // updateMap: false,
      notFoundMessage: 'Sorry, that address could not be found.',
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', onSelectResult);

    return () => map.removeControl(searchControl)
  }, []);

  return null;
};

const LocationSelector = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.field.name);

  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const markerRef = useRef(null);

  console.log({ field, meta, helpers });

  const style = {
    map: {
      height: '250px',
      width: '100%',
    }
  }

  const handleSelectResult = ({ location }) => {
    console.log(location)
    const {
      x: lon,
      y: lat,
    } = location;

    console.log('handleSelectResult', location);
    setMarkerPosition([lat, lon]);
    helpers.setValue(location);
  };

    const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current
        if (marker != null) {
          console.log('dragend', marker.getLatLng())
          const markerPosition = marker.getLatLng();
          const result = await searchReverseLocation({
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
          });

          helpers.setValue(result);

        }
      },
    }),
    [],
  )

  const theme = getTheme();

  return (
    <Stack
      style={{
        border: `1px solid ${theme.semanticColors.inputBorder}`,
      }}
    >
      <TextField
        value={get(field, ['value', 'label'], null)}
        readOnly
        prefix={<FontIcon iconName="MapPin" />}
        // iconProps={{ iconName: "mapPin" }}
        autoAdjustHeight
        multiline={!!get(field, ['value', 'label'], null) && field.value.label.length > 50}
        borderless
        placeholder='Set a location'
        onFocus={() => {
          console.log('focus')
        }}
      />
      {/* <Link>Change</Link> */}
      <MapContainer
        center={[53.3498, -6.2603]}
        zoom={13}
        style={style.map}
        whenCreated={(map) => {
          map.on('click', async (e) => {
            console.log('click', e);
            setMarkerPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom())
            const result = await searchReverseLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng, zoom: map.getZoom() });
            console.log(result);
            helpers.setValue(result);
          });

          map.on('geosearch/showlocation', (e) => {
            console.log('showlocation', e);
          });
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          ref={markerRef}
          position={markerPosition}
          draggable
          eventHandlers={eventHandlers}
        />
        <SearchControl onSelectResult={handleSelectResult} />
      </MapContainer>
    </Stack>
  )
}

export default LocationSelector;
