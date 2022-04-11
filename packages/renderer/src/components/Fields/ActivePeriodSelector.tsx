import { useState, useEffect } from 'react';
import { useField, Form, FormikProps, Formik } from 'formik';
import { DialogType, ActionButton, BaseButton, DefaultButton, DetailsList, Dialog, DialogFooter, getTheme, Label, Modal, PrimaryButton, TextField, DatePicker, Selection, SelectionMode } from '@fluentui/react';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const ActivePeriodPicker = ({ show, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  if (!show) { return null; }

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'Add Period of Involvement',
    subText: 'Enter the start and end dates of this actor\'s involvement in the crime.',
  };

  console.log({ startDate, endDate });

  return (
    <Dialog
      hidden={!show}
      onDismiss={onClose}
      dialogContentProps={dialogContentProps}
    >
      <DatePicker
        isRequired
        label="Start of Involvement"
        value={new Date(startDate)}
        onSelectDate={(date) => setStartDate(formatDate(date))}
      />
      <DatePicker
        isRequired
        label="End of Involvement"
        value={new Date(endDate)}
        onSelectDate={(date) => setEndDate(formatDate(date))}
      />
      <DialogFooter>
        <PrimaryButton onClick={() => onSubmit(startDate, endDate)}>Save</PrimaryButton>
        <DefaultButton onClick={onClose}>Cancel</DefaultButton>
      </DialogFooter>
    </Dialog>
  )
}

const ActivePeriodSelector = (props) => {
  const theme = getTheme();
  const [items, setItems] = useState([
    {
      key: 1,
      start: '2020-01-01',
      end: '2020-01-02',
    },
]);
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(props.name);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection()[0])
    },
  })

  useEffect(() => {
      // Do something with the selected item
      console.log(selectedItem)
  }, [selectedItem])

  const { value } = meta;

  const { setValue } = helpers;

  const columns = [
      {
        key: 'startDate',
        name: 'Start Date',
        fieldName: 'start',
        isRowHeader: true,
        isResizable: false,
        isSorted: false,
        data: 'date',
        isPadded: false,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        key: 'endDate',
        name: 'End Date',
        fieldName: 'end',
        isRowHeader: true,
        isResizable: false,
        isSorted: false,
        data: 'string',
        isPadded: false,
        minWidth: 100,
        maxWidth: 100,
      },
    ];

  const handleAddNew = (startDate, endDate) => {
    setItems([
      ...items,
      {
        key: items.length + 1,
        start: startDate,
        end: endDate,
      },
    ]);

    setShowPicker(false);
  }

  console.log({ meta, helpers, field })

  return (
    <div>
      <Label>{props.label}</Label>
      <ActivePeriodPicker
        show={showPicker}
        onClose={() => setShowPicker(false)}
        onSubmit={handleAddNew}
      />
      <DetailsList
        compact
        items={items}
        columns={columns}
        selection={selection}
        selectionMode={SelectionMode.single}
        onActiveItemChanged={(thing) => { console.log('onActiveItemChanged', thing)} }
      />
      <PrimaryButton iconProps={{ iconName: 'add'}} onClick={() => setShowPicker(true)}>Add</PrimaryButton>
      <ActionButton iconProps={{ iconName: 'edit'}}>Edit</ActionButton>
      <ActionButton iconProps={{ iconName: 'delete'}} color={theme.palette.red}>Delete</ActionButton>
    </div>
  )
}

export default ActivePeriodSelector;
