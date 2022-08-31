import Cytoscape from '../Cytoscape';
import EdgeDeletePanel from '../EdgeDeletePanel';
import Legend from '../Legend/Legend';
import './Visualisation.scss';

const Visualisation = ({
  panelOpen
}) => (
  <div id="Visualisation" className={`Visualisation ${panelOpen ? 'Visualisation--openPanel' : ''}`}>
    <EdgeDeletePanel />
    <Legend />
    <Cytoscape />
    <div id="cy-leaflet" />
  </div>
);

export default Visualisation;
