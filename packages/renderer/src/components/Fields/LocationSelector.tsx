import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { get, throttle } from 'lodash';
import { Text, getTheme, IconButton, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles, PrimaryButton, Icon, Link, useTheme, BaseButton, FontIcon } from "@fluentui/react";
import { OpenStreetMapProvider  } from 'react-leaflet-geosearch';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
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
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm ] = useState(get(field, ['value', 'label'], null));
  const [searchStatus, setSearchStatus] = useState('idle');
  const [searchResults, setSearchResults] = useState([]);
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
    setSearchTerm(null);
    setSearchResults([]);
    setMarkerPosition([0, 0]);
    helpers.setValue(null);
  }

  const doSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    const results = await search(searchTerm);
    setSearchResults(results);
    setSearchStatus('finished');
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
    setFocused(false);

    console.log('handle select result', location);
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

  const theme = getTheme();

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Update center and marker to existing value
    if (field.value) {
      const {
        x: lon,
        y: lat,
      } = field.value;
      setMarkerPosition([lat, lon]);
      map.setView([lat, lon], map.getZoom());
    }

    map.on('click', async (e) => {
      setMarkerPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const result = await searchReverseLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng, zoom: map.getZoom() });
      helpers.setValue(result);
    });

    return () => {
      if (map) {
        map.off('click');
      }
    }
  }, [map]);

  useEffect(() => {
    console.log('value', field.value);
    if (!field.value) {
      return;
    }

    if (map) {
      const {
        x: lon,
        y: lat,
      } = field.value;


      map.flyTo([lat, lon], map.getZoom());
    }
  }, [field.value])


  return (
    <Stack
      style={{
        border: `1px solid ${theme.semanticColors.inputBorder}`,
        position: 'relative',
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
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setSearchStatus('idle');
        }}
      />
      {focused && searchStatus !== 'idle' && (searchTerm && searchTerm.length > 0) && (
        <div
          className="results"
          style={{
            position: 'absolute',
            top: 32,
            left: -1,
            right: -1,
            // width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: `1px solid ${theme.semanticColors.inputBorder}`,
            zIndex: 9999,
            padding: '8px',
          }}
        >
          {/* { searchStatus === 'idle' && (
            <Text></Text>
          )} */}
          {searchStatus === 'searching' && (
            <Text>Searching...</Text>
          )}
          {searchStatus === 'finished' && searchResults.length === 0 && (
            <Text>No results found.</Text>
          )}
          {searchStatus === 'finished' && searchResults.length > 0 && (
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
      )}
      <MapContainer
        center={[53.3498, -6.2603]}
        zoom={13}
        scrollWheelZoom={false}
        style={style.map}
        whenCreated={(map) => {
          setMap(map);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          ref={markerRef}
          position={markerPosition}
          draggable
          eventHandlers={{
            async dragend() {
              const marker = markerRef.current
              if (marker != null) {
                const markerPosition = marker.getLatLng();
                const result = await searchReverseLocation({
                  latitude: markerPosition.lat,
                  longitude: markerPosition.lng,
                });

                handleSelectResult(result);
              }
            },
          }}
        />
      </MapContainer>
    </Stack>
  )
}

export default LocationSelector;
