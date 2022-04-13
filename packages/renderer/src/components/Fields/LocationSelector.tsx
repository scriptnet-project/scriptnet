import React, { useState } from 'react';
import { DefaultButton, getTheme, IconButton, mergeStyleSets, Modal, SearchBox, Stack, TextField, IIconProps, IStackProps, FontWeights, IButtonStyles } from "@fluentui/react";
import { SearchControl, OpenStreetMapProvider,  } from 'react-leaflet-geosearch';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useField } from 'formik';

const cancelIcon: IIconProps = { iconName: 'Cancel' };
const theme = getTheme();

const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    width: '700px',
    height: '500px',
  },
  header: [
    theme.fonts.xLarge,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  searchbar: {
    padding: '0 24px 24px 24px',
  },
  footer: {
    padding: '0 24px 24px 24px',
  },
  body: {
    flex: '4 4 auto',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const stackProps: Partial<IStackProps> = {
  horizontal: true,
  tokens: { childrenGap: 40 },
  styles: { root: { marginBottom: 20 } },
};
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const MapModal = ({ onClose }) => {
  const prov = OpenStreetMapProvider();
  const GeoSearchControlElement = SearchControl;
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');

  return (
    <Modal
      isOpen
      onDismissed={onClose}
      containerClassName="map-modal"

    >
      <div className={contentStyles.container}>
        <div className={contentStyles.header}>
          <span>Search for a location</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={onClose}
          />
        </div>
        <div className={contentStyles.searchbar}>
          <SearchBox placeholder="Search" onSearch={newValue => console.log('value is ' + newValue)} />
        </div>
        <div className={contentStyles.body}>
          <MapContainer center={[53.3498, -6.2603]} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className={contentStyles.footer}>
          <DefaultButton>Done</DefaultButton>
        </div>
      </div>
    </Modal>
  )
}

const LocationSelector = ({ label, ...props }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(props.field.name);

  return (
    <div>
      <TextField label={label} {...field} {...props} />
      <DefaultButton text="Open Map" onClick={() => {
        setShowPicker(true);
      }} />
      { showPicker && (
        <MapModal onClose={() => setShowPicker(false)} />
      )}
    </div>
  )
}

export default LocationSelector;
