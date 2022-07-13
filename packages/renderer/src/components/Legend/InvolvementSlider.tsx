import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCytoscape, useCytoscapeActions } from '@/hooks/Cytoscape';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@fluentui/react';
import { isEmpty } from 'lodash';

let maxPossibleDate = new Date(8640000000000000);
let minPossibleDate = new Date(-8640000000000000);

type Involvement = {
  key: number;
  start: string;
  end: string;
};

const getInvolvementRange = (involvements: Involvement[]) => {
  return involvements.reduce(
    (acc, curr) => {
      const start = curr.start ? new Date(curr.start) : minPossibleDate;
      const end = curr.end ? new Date(curr.end) : maxPossibleDate;
      if (start < acc.start) {
        acc.start = start;
      }
      if (end > acc.end) {
        acc.end = end;
      }
      return acc;
    }, { start: new Date(), end: new Date() }
  )
};

// Involvement 1: 01/2020 - 03/2020
// Involvement 2: 05/2020 - null

// Range slider:
//  - 01/2020 - 04/2020 - YES
//  - 06/2020 - All - YES
//  - 04/2020 - 04/2020 - NO

const nodeHasInvolvementWithinRange = (involvements: Involvement[], start: Date, end: Date) => {
  return involvements.some(involvement => {
    const startDate = involvement.start ? new Date(involvement.start) : minPossibleDate;
    const endDate = involvement.end ? new Date(involvement.end) : maxPossibleDate;
    return startDate <= start && endDate >= end;
  });
}

let filteredElements;

const InvolvementSlider = () => {
  const { cy } = useCytoscape();
  const {
    runLayout,
  } = useCytoscapeActions();

  const [ dates, setDates ] = useState([]);

  useEffect(() => {
    if(!cy) return;

    const nodes = cy.current.nodes();

    if (isEmpty(nodes)) {
      return;
    }

    const newDates = [];

    cy.current.nodes().map((node) => {
      const involvements = node.data('involvements');

      if (!involvements) {
        return;
      }

      involvements.forEach((involvement: Involvement) => {
        if (involvement.start) {
          newDates.push(involvement.start);
        }

        if (involvement.end) {
          newDates.push(involvement.end);
        }
      });
    });

    // Make sure we have unique dates
    const uniqueDates = new Set(newDates);

    // Sort dates
    const sortedDates = [...uniqueDates].sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const datesWithBounds = [
      minPossibleDate,
      ...sortedDates,
      maxPossibleDate,
    ]

    setDates(datesWithBounds);

  }, [cy.current]);

  const [sliderValue, setSliderValue] = useState([0, 0]);

  // Update the upper slider value when the dates change
  useEffect(() => {
    if (isEmpty(dates)) {
      return;
    }

    setSliderValue(value => [value[0], dates.length - 1]);
  }, [dates]);

  const onChange = useCallback((event, value) => {
    if (filteredElements) {
      filteredElements.restore();
      filteredElements = null;
    }

    setSliderValue(value);

    const [start, end] = value;

    // Don't filter at all if we are at "all" on both sides
    if (value[0] === 0 && value[1] === dates.length - 1) {
      return;
    }

    const minSliderDate = value[0] === 0 ? maxPossibleDate : new Date(dates[start]);
    const maxSliderDate = value[1] === dates.length -1 ? minPossibleDate : new Date(dates[end]);

    // Filter nodes whose involvements don't intersect the min and max dates
    filteredElements = cy.current.nodes().filter((node) => {
      const nodeInvolvements = node.data('involvements');

      // Remove nodes with no involvements
      if (!nodeInvolvements) {
        return false;
      }

      const involvementRange = getInvolvementRange(nodeInvolvements);

      const overlap = nodeHasInvolvementWithinRange(nodeInvolvements, minSliderDate, maxSliderDate);

      if (overlap) {
        return true;
      }

      return false;
    }).remove();

    runLayout();
  }, [cy, dates, sliderValue]);

  const formatValue = useCallback((value) => {
    if (isEmpty(dates)) {
      return '';
    }

    if (value === 0 || value === dates.length - 1) {
      return 'All';
    }

    const date = new Date(dates[value]);
    return date.toISOString().slice(0, 10);
  }, [dates]);

  console.log(dates);

  return (
    <motion.div
      className="involvement-slider-container"
      style={{
        position: 'absolute',
        width: 600,
        bottom: 95,
        left: 'calc(50% - 300px)',
        zIndex: 1,
        background: 'white',
        padding: 10,
        borderRadius: 10,
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

export default InvolvementSlider;
