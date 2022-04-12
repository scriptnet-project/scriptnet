import { useState, useEffect } from 'react';
import { useField, Form, FormikProps, Formik } from 'formik';
import { DialogType, ActionButton, BaseButton, DefaultButton, DetailsList, Dialog, DialogFooter, getTheme, Label, Modal, PrimaryButton, TextField, DatePicker, Selection, SelectionMode, IColumn, Stack } from '@fluentui/react';

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

const onFormatDate = (date?: Date): string => {
  return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
};

const ActivePeriodSelector = (props) => {
  const theme = getTheme();
  const [items, setItems] = useState([
    {
      key: 1,
      start: new Date('2020-01-01'),
      end: new Date('2020-01-02'),
    },
]);
  const [field, meta, helpers] = useField(props.name);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection()[0])
    },
  })

  useEffect(() => {
      // Do something with the selected item
      console.log('Selected: ', selectedItem)
  }, [selectedItem])

  const { value } = meta;

  const { setValue } = helpers;

  const COL_WIDTH = 145;

  const columns: IColumn[] = [
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'start',
      minWidth: COL_WIDTH,
      isResizable: false,
      isCollapsible: false,
      isPadded: false,
    },
    {
      key: 'endDate',
      name: 'End Date',
      fieldName: 'end',
      minWidth: COL_WIDTH,
      isResizable: false,
      isCollapsible: false,
      isPadded: false,
    },
  ];

  const handleAddNew = () => {
    setItems([
      ...items,
      {
        key: items.length + 1,
        start: new Date(),
        end: new Date(),
      },
    ]);
  }

  console.log({ meta, helpers, field });

  return (
    <Stack
    >
      <Label>{props.label}</Label>
      <DetailsList
        items={items}
        columns={columns}
        selection={selection}
        selectionMode={SelectionMode.single}
        checkboxVisibility={2}
        onRenderItemColumn={(item, index, column) => {
          console.log(item, index, column);
          const data = item[column.fieldName];
          return (
            <DatePicker value={data} />
          )
        }}
      />
      <Stack
        horizontal
        tokens={{
          padding: '10px 0px 0px 0px',
          childrenGap: '10px',
        }}
      >
        <PrimaryButton iconProps={{ iconName: 'add'}} onClick={handleAddNew}>Add</PrimaryButton>
        { selectedItem && (
          <PrimaryButton
            iconProps={{ iconName: 'delete', children: theme.palette.red}}
            style={{backgroundColor:theme.palette.red, color:'white'}}
            >
              Delete
            </PrimaryButton>
        )}
      </Stack>
    </Stack>
  )
}

export default ActivePeriodSelector;
