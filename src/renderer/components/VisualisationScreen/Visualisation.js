import React from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Text } from '@fluentui/react/lib/Text';
import './Visualisation.scss';

const iconClass = mergeStyles({
  fontSize: 50,
  height: 50,
  width: 50,
  margin: '0 25px',
});

const Visualisation = () => (
  <div className="Visualisation">
    <Text>This is the visualisation screen</Text>
    <FontIcon iconName="CompassNW" className={iconClass} />
  </div>
);

export default Visualisation;
