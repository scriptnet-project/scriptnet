import { useState, useEffect } from 'react';
import { FieldHookConfig, useField } from 'formik';
import {
  DetailsList,
  getTheme,
  PrimaryButton,
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
import { get } from 'lodash';

const getFormattedValue = (data: Date) => {
  if (!data) {
    return undefined;
  }

  if (typeof data.toDateString === 'function') {
    return data;
  }

  return new Date(data);
}

type Item = {
  key: number
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

type ActivePeriodSelectorProps = {
  name: string,
  push: Function,
  remove: Function,
  replace: Function
};

const ActivePeriodSelector = (props: ActivePeriodSelectorProps) => {
  const {
    name,
    push,
    remove,
    replace,
  } = props;

  const theme = getTheme();
  const [field, meta] = useField(name);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

  const selection = new Selection({
    onSelectionChanged: () => {
      const selected = selection.getSelection()[0] as Item;
      setSelectedItem(selected);
    },
  })

  useEffect(() => {
      // Do something with the selected item
  }, [selectedItem])

  const { touched, error } = meta;

  const handleAddNew = () => {
    push({
      key: field.value.length + 1,
      start: undefined,
      end: undefined,
    });
  }

  const handleDeleteSelectedItem = () => {
    // Find index of selected item by key
    const index = field.value.findIndex((item: Item) => {
      if (!selectedItem) { return; }
      return item.key === selectedItem.key
    } );
    remove(index);
    setSelectedItem(undefined);
  }

  const renderSingleError = (error: string) => <Text variant="small" styles={{ root: { color: theme.palette.red } }}>{error}</Text>

  const renderError = (error: string | []) => {
    if (typeof error === 'string') {
      return renderSingleError(error);
    }

    return (
      <>
        {/* <p>
          {renderSingleError('Multiple errors found.')}
        </p> */}
        {error.map((err, i) => {

          // When an error is resolved, the array item is set to 'undefined'
          if (!err) {
            return null;
          }

          const keys = Object.keys(err);
          return (
            <Stack key={i}>
              {renderSingleError(`Period ${i + 1}`)}
              <ul>
                {keys.map((key, index) => (
                  <li key={`${i}_${key}_${index}`}>
                    {renderSingleError(err[key])}
                  </li>
                ))}
              </ul>
            </Stack>
          )
        })}
      </>
    )
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
          items={field.value}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          checkboxVisibility={2}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          constrainMode={ConstrainMode.horizontalConstrained}
          onRenderItemColumn={(item, index, column) => {
            const dataIndex = get(column, 'fieldName', 0);
            const data = item[dataIndex];

            return (
              <DatePicker
                value={getFormattedValue(data)}
                onSelectDate={(date) => {
                  replace(index, {
                    ...item,
                    [dataIndex]: date,
                  })
                }}
              />
            )
          }}
          styles={detailsStyles}
        />
        { !field.value.length && (
          <Stack horizontalAlign='center' style={{ paddingBottom: theme.spacing.m }}>
            <Text>No periods of involvement defined.</Text>
          </Stack>
        )}
        { touched && error && (
          <Stack>
            <Text
              styles={{
                root: {
                  color: theme.semanticColors.errorText,
                  fontSize: theme.fonts.small.fontSize,
                  padding: theme.spacing.s1,
                },
              }}
            >
              {renderError(error)}
            </Text>
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
