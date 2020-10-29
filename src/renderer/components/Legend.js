import React from 'react';
import { useSelector } from 'react-redux';
import { modes } from 'Store/mode';

// Edges:

//     personal = yellow
//     communication = purpleLight
//     financial = greenLight
//     business = tealLight
//     ownership = magentaLight

// Nodes:

//     person = blue
//     location = purple
//     resource = tealLight
//     organisation = orange


const getElements = (mode) => {
  switch(mode) {
    case modes.CREATE_EDGES:
    case modes.ASSIGN_ATTRIBUTES:
    case modes.VIEW_DETAILS:
    case modes.CONFIGURE:
    default:
      return {};
  }
};

const Legend = () => {
  const mode = useSelector(state => state.mode.mode);



  return (
    <div>

    </div>
  );
 };

export default Legend;
