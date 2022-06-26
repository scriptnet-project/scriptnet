import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { debounce, get, throttle } from 'lodash';
import { Text, DefaultButton, getTheme, IconButton, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles, PrimaryButton, Icon, Link, useTheme, BaseButton, FontIcon } from "@fluentui/react";
import { OpenStreetMapProvider  } from 'react-leaflet-geosearch';
import { GeoSearchControl } from 'leaflet-geosearch';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { useField } from 'formik';
import { searchReverseLocation } from '@/utils/searchReverseLocation';

type SearchControlProps = {
  onSelectResult: (location: any) => void;
}

  const provider = new OpenStreetMapProvider();

const search = async (term: string) => await provider.search({ query: term });

const ClearButton = ({ onClick }) => {
  const theme = useTheme();

  return (
    <IconButton
      iconProps={{ iconName: 'Clear' }}
      // styles={styles}
      onClick={onClick}
    />
  );
};


const LocationSelector = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.field.name);
  const [searchTerm, setSearchTerm ] = useState(get(field, ['value', 'label'], null));
  const [searchStatus, setSearchStatus] = useState('idle');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([get(field, ['value', 'x'], 0), get(field, ['value', 'y'], 0)]);
  const markerRef = useRef(null);

  const style = {
    map: {
      height: '250px',
      width: '100%',
    }
  }

  type ResultProps = {
    location: {
      x: number;
      y: number;
    };
  }

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedResult(null);
    helpers.setValue({});
  }

  const doSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    const results = await search(searchTerm);
    setSearchResults(results);
    setSearchStatus('idle');
  };

  const throttledSearch = useCallback(throttle(doSearch, 500, { leading: false, trailing: true }), []);

  const handleSearch = (searchTerm: string) => {
    if(!searchTerm) {
      setSearchStatus('idle');
      setSearchResults([]);
      setSearchTerm('');
      return;
    }

    setSearchStatus('searching');
    setSearchTerm(searchTerm);
    throttledSearch(searchTerm);
  };

  const handleSelectResult = (location) => {
    const {
      x: lon,
      y: lat,
      label,
    } = location;

    setMarkerPosition([lat, lon]);
    setSearchTerm(label);
    setSearchStatus('idle');
    setSearchResults([]);
    helpers.setValue(location);
  };

    const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current
        if (marker != null) {
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
        value={searchTerm}
        onChange={(e, newValue) => handleSearch(newValue)}
        prefix={<Icon iconName="MapPin" />}
        autoAdjustHeight
        borderless
        placeholder='Search for a location...'
        onRenderSuffix={() => <ClearButton onClick={handleClear} />}
      />
      <div
        className="results"
        style={{
        }}
      >
        {searchStatus === 'searching' && (
          <Text>Searching...</Text>
        )}
        {searchStatus === 'idle' && searchResults.length === 0 && (
          <Text>No results found.</Text>
        )}
        {searchStatus === 'idle' && (
          <>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelectResult(result)}
                style={{
                  cursor: 'pointer',
                  padding: '5px',
                }}
              >
                <Text>{result.label}</Text>
              </div>
            ))}
          </>
        )}
      </div>
      {/* <Link>Change</Link> */}
      <MapContainer
        center={[53.3498, -6.2603]}
        zoom={13}
        scrollWheelZoom={false}
        style={style.map}
        whenCreated={(map) => {
          // Update center and marker to existing value
          if (field.value) {
            const {
              x: lon,
              y: lat,
            } = field.value;
            setMarkerPosition([lat, lon]);
            map.setView([lat, lon], 13);
          }

          map.on('click', async (e) => {
            setMarkerPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom())
            const result = await searchReverseLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng, zoom: map.getZoom() });
            helpers.setValue(result);
          });
          // map.on('geosearch/showlocation', (e) => {
          //   console.log('showlocation', e);
          // });
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
      </MapContainer>
    </Stack>
  )
}

export default LocationSelector;
