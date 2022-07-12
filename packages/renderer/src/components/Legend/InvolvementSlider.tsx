import { useState, useCallback, useMemo } from 'react';
import useCytoscape from '@/hooks/Cytoscape';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@fluentui/react';

const InvolvementSlider = () => {
  const { id } = useCytoscape();
  const dispatch = useDispatch();
  // const { involvement } = useSelector(s => s.visualisation);

  const dates = [
    'Start',
    '2022-03-31T22:00:00.000Z',
    '2022-04-04T22:00:00.000Z',
    '2022-04-12T22:00:00.000Z',
    '2022-04-15T22:00:00.000Z',
    'Future',
  ];

  const max = useMemo(() => dates.length -1, [dates]);
  const [sliderValue, setSliderValue] = useState([0, max]);

  const onChange = useCallback((event, value) => {
    setSliderValue(value);
    // dispatch(visualisationActions.setInvolvement(value));
  }, [id, dispatch]);

  const formatValue = useCallback((value) => {
    // First and last entries are special
    if (value === max || value === 0) {
      return dates[value];
    }

    // Middle entries are formatted as dates
    const date = new Date(dates[value]);

    // Ensure that the date is in the correct format
    return date.toISOString().slice(0, 10);
  }, [dates])

  return (
    <>
      <Slider
        label="Period(s) of Involvement"
        min={0}
        max={max}
        step={1}
        lowerValue={sliderValue[0]}
        value={sliderValue[1]}
        valueFormat={formatValue}
        // defaultLowerValue
        // value={involvement}
        onChange={onChange}
        // showValue
        ranged
        styles={{
          valueLabel: {
            width: '80px'
          }
        }}
      />
    </>
  )
};

export default InvolvementSlider;
