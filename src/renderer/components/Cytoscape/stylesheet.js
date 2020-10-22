import { getTheme } from '@fluentui/react';

const theme = getTheme();

export const stylesheet = [
  {
    selector: '.eh-handle',
    style: {
      'background-color': theme.palette.yellow,
      'width': 12,
      'height': 12,
      'shape': 'ellipse',
      'overlay-opacity': 0,
      'border-width': 5, // makes the handle easier to hit
      'border-opacity': 0
    }
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': theme.palette.yellow,
      'line-color': theme.palette.yellow,
      'target-arrow-color': theme.palette.yellow,
      'source-arrow-color': theme.palette.yellow
    }
  },

  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      'opacity': 0
    }
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'lineColor': theme.palette.themeTertiary,
    }
  },
  {
    selector: 'edge[type = "personal"]',
    style: {
      'lineColor': theme.palette.yellow,
    },
  },
  {
    selector: 'edge[type = "communication"]',
    style: {
      'lineColor': theme.palette.purpleLight,
    },
  },
  {
    selector: 'edge[type = "financial"]',
    style: {
      'lineColor': theme.palette.greenLight,
    },
  },
  {
    selector: 'edge[type = "business"]',
    style: {
      'lineColor': theme.palette.tealLight,
    },
  },
  {
    selector: 'edge[type = "ownership"]',
    style: {
      'lineColor': theme.palette.magentaLight,
    },
  },
  {
    selector: 'node',
    style: {
      'font-size': 12,
      'color': theme.palette.themeDarker,
      'text-margin-y': 5,
      "text-valign": "bottom",
      "text-halign": "bottom",
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 5,
      'border-color': theme.palette.yellow
    }
  },
  {
    selector: '.highlighted',
    style: {
      'border-width': 5,
      'border-color': theme.palette.yellowLight
    }
  },
  {
    selector: 'node[type = "person"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.blue,
      shape: 'circle'
    },
  },
  {
    selector: 'node[type = "location"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.purple,
      shape: 'round-rectangle',
    },
  },
  {
    selector: 'node[type = "resource"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.tealLight,
      shape: 'round-triangle',
    },
  },
  {
    selector: 'node[type = "organisation"]',
    style: {
      label: "data(name)",
      'background-color': theme.palette.orange,
      shape: 'diamond',
    },
  },
];

export default stylesheet;
