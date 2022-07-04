import { useState, useCallback } from 'react';
import {
  CommandBar,
  DefaultButton,
  getTheme,
  ICommandBarItemProps,
  PrimaryButton,
  ThemeProvider,
  Toggle,
} from '@fluentui/react';
import { useCytoscape, useCytoscapeActions } from '../../hooks/Cytoscape';
// import './CommandBar.scss';
import { actionCreators as visualisationActions } from '../../store/visualisation';
import { actionCreators as modeActions, modes } from '../../store/mode';
import { useDispatch, useSelector } from 'react-redux';
import panelTheme from '../../themes/panel';
import Forms from '../Forms/Forms';

const TopCommandBar = ({
}) => {
  const { cy, id } = useCytoscape();

  const {
    newNetwork,
    saveNetwork,
    exportPNG,
    exportCSV,
  } = useCytoscapeActions();

  const mode = useSelector(state => state.mode);
  const dispatch = useDispatch();
  const setMode = (mode) => dispatch(modeActions.setMode(mode));

  const [form, setForm] = useState(null);

  const setVisualisation = useCallback((event, option) => {
    console.log('changed preset to:', option.key);
    setMode(modes.CONFIGURE);
    dispatch(modeActions.setOption('preset', option.key));
  }, [id]);

  const items = [
    {
      key: 'Save',
      text: 'Save Case',
      iconProps: { iconName: 'Save' },
      onClick: saveNetwork,
    },
    // {
    //   key: 'Cases',
    //   text: 'Cases',
    //   iconProps: { iconName: 'Album' },
    //   subMenuProps: {
    //     items: [
    //       {
    //         key: 'New',
    //         text: 'New Case',
    //         iconProps: { iconName: 'Add' },
    //         onClick: newNetwork,
    //       },

    //       {
    //         key: 'Open',
    //         text: 'Open Case',
    //         iconProps: { iconName: 'FolderOpen' },
    //         onClick: openNetwork,
    //       },
    //     ],
    //   },
    // },
    // {
    //   key: 'Export',
    //   text: 'Export',
    //   iconProps: { iconName: 'ShareiOS' },
    //   subMenuProps: {
    //     items: [
    //       {
    //         key: 'Export',
    //         text: 'Export Screenshot',
    //         iconProps: { iconName: 'Share' },
    //         onClick: () => exportPNG(),
    //       },
    //       {
    //         key: 'ExportCSV',
    //         text: 'Export CSV',
    //         iconProps: { iconName: 'Export' },
    //         onClick: exportCSV,
    //       }
    //     ],
    //   },
    // },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'addNodes',
      text: 'Add Node',
      iconProps: { iconName: 'AddFriend' },
      onMenuClick: () => setMode(modes.DEFAULT),
      subMenuProps: {
        items: [
          {
            key: 'addPerson',
            text: 'Person',
            iconProps: { iconName: 'AddFriend' },
          },
          {
            key: 'addOrganisation',
            text: 'Organisation',
            iconProps: { iconName: 'Work' },
          },
          {
            key: 'addLocation',
            text: 'Location',
            iconProps: { iconName: 'MapPin' },
          },
          {
            key: 'addResource',
            text: 'Resource',
            iconProps: { iconName: 'SharepointAppIcon16' },
          }
        ],
      }
    },
    {
      key: 'addEdges',
      text: 'Add Relationships',
      iconProps: { iconName: 'GitGraph' },
      onClick: () => setMode(modes.CREATE_EDGES),

    },
    {
      key: 'addScenes',
      text: 'Add Scenes',
      iconProps: { iconName: 'Fingerprint' },
      onClick: () => setMode(modes.ASSIGN_ATTRIBUTES)
    },
    {
      key: 'showVisualisation',
      text: 'Visualise',
      iconProps: { iconName: 'PictureFill' },
      subMenuProps: {
        items: [
          {
            key: 'scene',
            text: 'Scenes',
            onClick: setVisualisation,
          },
          {
            key: 'relationship-filter',
            text: 'Relationships',
            onClick: setVisualisation,
          },
          {
            key: 'focal',
            text: 'Focal Individual',
            onClick: setVisualisation,
          },
          {
            key: 'jurisdiction',
            text: 'Jurisdictions',
            onClick: setVisualisation,
          },
          {
            key: 'geography',
            text: 'Locations',
            onClick: setVisualisation,
          }
        ],
      },
    },
    // {
    //   key: 'run layout',
    //   text: 'Run Automatic Layout',
    //   iconProps: { iconName: 'AutoEnhanceOn' },
    //   onClick: () => runLayout(),
    // },
    // {
    //   key: 'zoomin',
    //   iconOnly: true,
    //   iconProps: { iconName: 'ZoomIn' },
    //   onClick: () => {
    //     cy.current.animate({
    //       'zoom': cy.current.zoom() + 0.5,
    //    });
    //   },
    // },
    // {
    //   key: 'zoomout',
    //   iconOnly: true,
    //   iconProps: { iconName: 'ZoomOut' },
    //   onClick: () => {
    //     cy.current.animate({
    //       'zoom': cy.current.zoom() - 0.5,
    //    });
    //   },
    // },
    {
      key: 'fit',
      text: 'Center view',
      iconProps: { iconName: 'ZoomToFit' },
      onClick: () => cy.current.animate({
        fit: {
          eles: 'node',
          padding: 100,
        }
      }, {
        duration: 500
      }),
    }
  ];

  const theme = getTheme();

  return (
    <ThemeProvider theme={panelTheme}>
      <Forms
        form={form}
        onClose={() => setForm(null)}
      />
      <div className="CommandBar">
        <CommandBar
          items={items}
          farItems={farItems}
          ariaLabel="Use left and right arrow keys to navigate between commands"
          styles={{
            root: {
              boxShadow: theme.effects.elevation16,
              zIndex: 9999,
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default TopCommandBar;

