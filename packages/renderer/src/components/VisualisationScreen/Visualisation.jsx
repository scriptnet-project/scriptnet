import Cytoscape from '../Cytoscape';
import Legend from '../Legend';
import './Visualisation.scss';

const Visualisation = ({
  panelOpen
}) => (
  <div id="Visualisation" className={`Visualisation ${panelOpen ? 'Visualisation--openPanel' : ''}`}>
    <Legend />
    <Cytoscape />
    <div id="cy-leaflet" />
  </div>
);

export default Visualisation;
