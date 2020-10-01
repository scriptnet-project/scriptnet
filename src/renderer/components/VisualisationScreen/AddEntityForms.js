import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ChoiceGroup,
  TextField,
} from '@fluentui/react';
import useCytoscape from 'Hooks/useCytoscape';
import { useForm, Controller } from "react-hook-form";

const AddNodeForm = ({
  toggleHideDialog,
  hideDialog,
  type,
}) => {
  const { register, handleSubmit, watch, errors, control } = useForm();
  const [cy, cyActions] = useCytoscape();

  const renderFormContentForType = type => {
    switch(type) {
      case 'person':
        return (
          <React.Fragment>
            <Controller
              as={TextField}
              name="name"
              label="What is this person's name?"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </React.Fragment>
        )
        case 'place':
          return (
            <React.Fragment>
              <Controller
                as={TextField}
                name="name"
                label="What is the name of this place?"
                control={control}
                rules={{ required: true }}
                defaultValue=""
              />
              <Controller
                as={TextField}
                name="location"
                label="What is the location of this place?"
                control={control}
                defaultValue=""
              />
            </React.Fragment>
          )
      default:
        return (
          <React.Fragment>
            <Controller
              as={TextField}
              name="name"
              label="What is the name of this actor?"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </React.Fragment>
        )
    }
  }

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData, 'errors:', errors);
    cy.add({
      group: 'nodes',
      data: {
        type,
        ...formData
      },
    });

    cyActions.runLayout();
    toggleHideDialog();
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add an Actor',
        subText: 'Use the form below to enter the details of an actor (person, place, resource, or business) that was involved in this crime.',
      }}
      modalProps={{
        isBlocking: true, // Makes background click close dialog
      }}
      maxWidth="500px" // Default is too narrow - could use grid size?
    >
        <form onSubmit={handleSubmit(handleFormSubmit)} >
          { renderFormContentForType(type) }
        </form>
      <DialogFooter>
        <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        <PrimaryButton onClick={handleSubmit(handleFormSubmit)}  text="Add to Network" />
      </DialogFooter>
    </Dialog>
  );
}

export const AddPersonForm = (props) => (<AddNodeForm type="person" {...props} />);
export const AddPlaceForm = (props) => (<AddNodeForm type="place" {...props} />);
export const AddResourceForm = (props) => (<AddNodeForm type="resource" {...props} />);
export const AddBusinessForm = (props) => (<AddNodeForm type="business" {...props} />);


