import { useState, useEffect } from 'react';
import { useField, Form, FormikProps, Formik } from 'formik';
import {
  DetailsList,
  getTheme,
  PrimaryButton,
  TextField,
  DatePicker,
  Selection,
  SelectionMode,
  IColumn,
  Stack,
  IDetailsListStyles,
  DetailsListLayoutMode,
  ConstrainMode,
  Text,
} from '@fluentui/react';

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
  const [items, setItems] = useState([]);
  const [field, meta, helpers] = useField(props.field.name);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection()[0])
    },
  })

  useEffect(() => {
      // Do something with the selected item
  }, [selectedItem])

  const { value } = meta;
  const { setValue } = helpers;

  const columns: IColumn[] = [
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'start',
      minWidth: 0,
      maxWidth: 0,
    },
    {
      key: 'endDate',
      name: 'End Date',
      fieldName: 'end',
      minWidth: 0,
      maxWidth: 0,
    },
  ];

  const handleAddNew = () => {
    setItems([
      ...items,
      {
        key: items.length + 1,
        start: null,
        end: null,
      },
    ]);
  }

  const detailsStyles: IDetailsListStyles = {
    root: {
      '.ms-DetailsRow-cell, .ms-DetailsHeader-cell': {
        width: '50% !important',
      },
      '.ms-DetailsRow-fields, .ms-DetailsRow': {
        width: '100%',
      },
    },
    headerWrapper: {
      '.ms-DetailsHeader': {
        padding: 0,
      },
    },
    focusZone: undefined,
    contentWrapper: undefined
  };

  const handleDeleteSelectedItem = () => {
    const newItems = items.filter(item => item.key !== selectedItem.key);
    setItems(newItems);
    setSelectedItem(undefined);
  }


  return (
    <Stack>
        <div
          style={{
            border: `1px solid ${theme.semanticColors.inputBorder}`,
          }}
        >
        <DetailsList
          theme={theme}
          items={items}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          checkboxVisibility={2}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          constrainMode={ConstrainMode.horizontalConstrained}
          onRenderItemColumn={(item, index, { fieldName }: IColumn) => {
            const data = item[fieldName];
            return (
              <DatePicker value={data} />
            )
          }}
          styles={detailsStyles}
        />
        { !items.length && (
          <Stack horizontalAlign='center' style={{ paddingBottom: theme.spacing.m }}>
            <Text>No periods of involvement defined.</Text>
          </Stack>
        )}
        <Stack
          horizontal
          tokens={{
            padding: theme.spacing.s1,
            childrenGap: theme.spacing.s1,
          }}
        >
          <PrimaryButton iconProps={{ iconName: 'add'}} onClick={handleAddNew}>Add</PrimaryButton>
          { selectedItem && (
            <PrimaryButton
              iconProps={{ iconName: 'delete', children: theme.palette.red}}
              style={{backgroundColor:theme.palette.red, color:'white'}}
              onClick={handleDeleteSelectedItem}
              >
                Delete
              </PrimaryButton>
          )}
        </Stack>
      </div>
    </Stack>
  )
}

export default ActivePeriodSelector;
