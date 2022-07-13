import { useState, useCallback, useMemo, useEffect } from 'react';
import useCytoscape from '@/hooks/Cytoscape';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@fluentui/react';
import { isEmpty } from 'lodash';

type Involvement = {
  key: number;
  start: string;
  end: string;
};

const getHighest = (dateArray: []) => {
  return dateArray.reduce((highest, date) => {
    if (date > highest) {
      return date;
    }
    return highest;
  }, new Date(0));
}

const getLowest = (dateArray: []) => {
  return dateArray.reduce((lowest, date) => {
    if (date < lowest) {
      return date;
    }
    return lowest;
  }, new Date(0));
}

let filteredElements;

const InvolvementSlider = () => {
  const { cy } = useCytoscape();
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
      -Infinity,
      ...sortedDates,
      Infinity
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

    filteredElements = cy.current.nodes().filter((node) => {
      const nodeInvolvements = node.data('involvements');

      // Filter nodes with no involvements
      if (!nodeInvolvements) {
        return true;
      }

      const highestEnd = getHighest(nodeInvolvements.map((involvement: Involvement) => {
        if (involvement.end) {
          return new Date(involvement.end);
        }
        return Infinity;
      }));

      const lowestStart = getLowest(nodeInvolvements.map((involvement: Involvement) => {
        if (involvement.start) {
          return new Date(involvement.start);
        }
        return -Infinity;
      }));

      const sliderEnd = new Date(dates[end]);
      const sliderStart = new Date(dates[start]);

      return highestEnd > sliderEnd || lowestStart < sliderStart;
    }).remove();
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
