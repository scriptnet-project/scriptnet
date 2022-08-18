import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { get, throttle } from 'lodash';
import { Text, getTheme, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles, PrimaryButton, Icon, Link, useTheme, BaseButton, FontIcon } from "@fluentui/react";
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
    <Icon
      iconName="Clear"
      styles={{
        root: {
          cursor: 'pointer',
        },
      }}
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
  const [showSearchResultsPanel, setShowSearchResultsPanel] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([get(field, ['value', 'x'], 0), get(field, ['value', 'y'], 0)]);
  const markerRef = useRef(null);

  const style = {
    map: {
      height: '250px',
      width: '100%',
    }
  }

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
      setSearchTerm(result.label);
    });

    return () => {
      if (map) {
        map.off('click');
      }
    }
  }, [map]);

  useEffect(() => {
    console.log('field value', field.value);
    if (map && field.value && field.value.x && field.value.y) {
      const location = {
        lng: field.value.x,
        lat: field.value.y,
      };

      map.flyTo(location, map.getZoom());
    }
  }, [field.value])

  const resetState = () => {
    setSearchTerm(null);
    setSearchResults([]);
    setSelectedResult(null);
    setMarkerPosition(null);
    setShowSearchResultsPanel(false);
  }

  const handleClear = () => {
    resetState();
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
      resetState();
      return;
    }

    if (!showSearchResultsPanel) {
      setShowSearchResultsPanel(true);
    }

    setSearchStatus('searching');
    setSearchTerm(searchTerm);
    throttledSearch(searchTerm);
  };

  const handleSelectResult = (location) => {
    console.log('handleselectresult', location);
    const {
      x: lon,
      y: lat,
      label,
    } = location;

    resetState();

    setMarkerPosition([lat, lon]);
    setSearchTerm(label);
    helpers.setValue(location);
  };

  const theme = getTheme();

  return (
    <Stack
      style={{
        // border: `1px solid ${theme.semanticColors.inputBorder}`,
      }}
    >
      <TextField
        value={searchTerm}
        onChange={(e, newValue) => handleSearch(newValue)}
        prefix={<Icon iconName="MapPin" />}
        autoAdjustHeight
        placeholder='Search for a location...'
        onRenderSuffix={() => <ClearButton onClick={handleClear} />}
        // onBlur={(e) => {
        //   console.log('onBlur', e);
        //   setShowSearchResultsPanel(false);
        // }}
      />
      { showSearchResultsPanel && (
        <div
          className="results"
          style={{
            boxShadow: 'rgb(0 0 0 / 22%) 0px 25.6px 57.6px 0px, rgb(0 0 0 / 18%) 0px 4.8px 14.4px 0px',
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
        { markerPosition && (
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
        )}
      </MapContainer>
    </Stack>
  )
}

export default LocationSelector;
