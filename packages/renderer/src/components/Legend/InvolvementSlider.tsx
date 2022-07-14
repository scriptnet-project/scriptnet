import { useState, useEffect } from 'react';
import { useCytoscape, useCytoscapeActions } from '@/hooks/Cytoscape';
import { AnimatePresence, motion } from 'framer-motion';
import { Slider } from '@fluentui/react';
import { isEmpty } from 'lodash';
import { getMode } from '../../store/selectors/mode';
import { modes } from '../../store/mode';
import { CollectionGraphManipulation, NodeSingular } from 'cytoscape';
import { useSelector } from 'react-redux';

let maxPossibleDate = new Date(8640000000000000);
let minPossibleDate = new Date(-8640000000000000);

type Involvement = {
  key: number;
  start: string;
  end: string;
};

const nodeHasInvolvementWithinRange = (involvements: Involvement[], start: Date, end: Date) => {
  return involvements.some((involvement: Involvement) => {
    const startDate = involvement.start ? new Date(involvement.start) : minPossibleDate;
    const endDate = involvement.end ? new Date(involvement.end) : maxPossibleDate;

    // startDate is after start OR
    // endDate is after start date and before end date
    return (startDate >= start && startDate <= end) || (endDate >= start && endDate <= end);
  });
}

let filteredElements: CollectionGraphManipulation | null;

const InvolvementSlider = () => {
  const { cy } = useCytoscape();
  const {
    runLayout,
  } = useCytoscapeActions();

  const [ dates, setDates ] = useState([] as Date[]);
  const [sliderValue, setSliderValue] = useState([0, 0]);

  useEffect(() => {
    if(!cy) return;

    const nodes = cy.current.nodes();

    if (isEmpty(nodes)) {
      return;
    }

    const newDates: Date[] = [];

    // Put all dates in all involvements into an array
    cy.current.nodes().forEach((node: NodeSingular) => {
      const involvements = node.data('involvements');

      if (!involvements) {
        return;
      }

      involvements.forEach((involvement: Involvement) => {
        if (involvement.start) {
          newDates.push(new Date(involvement.start));
        }

        if (involvement.end) {
          newDates.push(new Date(involvement.end));
        }
      });
    });

    // Make sure we have unique dates
    const uniqueDates = [...new Set(newDates)];

    // Sort dates
    const sortedDates = uniqueDates.sort((a, b) => a.getTime() - b.getTime());

    const datesWithBounds = [
      minPossibleDate,
      ...sortedDates,
      maxPossibleDate,
    ];

    setDates(datesWithBounds);
    setSliderValue(([lower]) => ([lower, datesWithBounds.length - 1]));
  }, [cy.current]);

  const restoreFilteredNodes = () => {
    if (filteredElements) {
      filteredElements.restore();
      filteredElements = null;
    }

    runLayout();
  }

  // Change handler
  const onChange = (_: number, value: [number, number] | undefined) => {
    // Reject if upper value is within 1 of lower value
    if (! value || value[1] - value[0] < 1) {
      return;
    }

    setSliderValue(value); // Update the slider value

    const [lowerValueIndex, upperValueIndex] = value;
    // Start with the full unfiltered network, by restoring any previously filtered items
    restoreFilteredNodes();

    // Don't filter at all if we are at "all" on both sides
    if (lowerValueIndex === 0 && upperValueIndex === dates.length - 1) {
      return;
    }

    // Get the dates for the lower and upper slider values based on the index in the dates array
    const lowerValueDate = lowerValueIndex === 0 ? minPossibleDate : dates[lowerValueIndex];
    const upperValueDate = upperValueIndex === dates.length -1 ? maxPossibleDate : dates[upperValueIndex];

    // Filter nodes whose involvements don't intersect the min and max dates
    filteredElements = cy.current.nodes().filter((node: NodeSingular) => {
      const nodeInvolvements = node.data('involvements');

      // Remove nodes with no involvements
      if (!nodeInvolvements) {
        return true;
      }

      if (nodeHasInvolvementWithinRange(nodeInvolvements, lowerValueDate, upperValueDate)) {
        return false;
      }

      return true;
    }).remove();

    runLayout();
  };

  // Function to format the slider values in YYYY-MM-DD format
  const formatValue = (value: number) => {
    if (isEmpty(dates)) {
      return '';
    }

    if (value === 0) {
      return 'All Past';
    }

    if (value === dates.length - 1) {
      return 'All Future';
    }

    const date = dates[value];
    return date.toLocaleDateString();
  };

  useEffect(() => {
    return () => {
      restoreFilteredNodes();
    }
  }, []);

  return (
    <motion.div
      className="involvement-slider-container"
      style={{
        position: 'absolute',
        width: 500,
        bottom: 95,
        left: 'calc(50% - 250px)',
        zIndex: 1,
      }}
    >
      <Slider
        label="Period(s) of Involvement"
        min={0}
        max={dates.length - 1}
        step={1}
        lowerValue={sliderValue[0]}
        value={sliderValue[1]}
        valueFormat={formatValue}
        onChange={onChange}
        ranged
        styles={{
          valueLabel: {
            width: '80px'
          }
        }}
      />
    </motion.div>
  )
};

const Wrapper = () => {
  const mode = useSelector(getMode);

  return (
    <AnimatePresence>
      { (mode === modes.DEFAULT || mode === modes.CONFIGURE) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <InvolvementSlider />
        </motion.div>
      ) }
    </AnimatePresence>
  );

}

export default Wrapper;
