import React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  ComboBox,
} from '@fluentui/react';
import useCytoscape from 'Hooks/useCytoscape';
import { Field, Form, Formik } from 'formik';
import { FormikTextField, FormikDropdown } from 'formik-office-ui-fabric-react'

const locationOptions = [
  {key: 'N/A', text: 'N/A'},
  {key: 'Ireland', text: 'Ireland'},
  {key: 'United Kingdom', text: 'United Kingdom'},
  {key: 'Afghanistan', text: 'Afghanistan'},
  {key: 'Åland Islands', text: 'Åland Islands'},
  {key: 'Albania', text: 'Albania'},
  {key: 'Algeria', text: 'Algeria'},
  {key: 'American Samoa', text: 'American Samoa'},
  {key: 'AndorrA', text: 'AndorrA'},
  {key: 'Angola', text: 'Angola'},
  {key: 'Anguilla', text: 'Anguilla'},
  {key: 'Antarctica', text: 'Antarctica'},
  {key: 'Antigua and Barbuda', text: 'Antigua and Barbuda'},
  {key: 'Argentina', text: 'Argentina'},
  {key: 'Armenia', text: 'Armenia'},
  {key: 'Aruba', text: 'Aruba'},
  {key: 'Australia', text: 'Australia'},
  {key: 'Austria', text: 'Austria'},
  {key: 'Azerbaijan', text: 'Azerbaijan'},
  {key: 'Bahamas', text: 'Bahamas'},
  {key: 'Bahrain', text: 'Bahrain'},
  {key: 'Bangladesh', text: 'Bangladesh'},
  {key: 'Barbados', text: 'Barbados'},
  {key: 'Belarus', text: 'Belarus'},
  {key: 'Belgium', text: 'Belgium'},
  {key: 'Belize', text: 'Belize'},
  {key: 'Benin', text: 'Benin'},
  {key: 'Bermuda', text: 'Bermuda'},
  {key: 'Bhutan', text: 'Bhutan'},
  {key: 'Bolivia', text: 'Bolivia'},
  {key: 'Bosnia and Herzegovina', text: 'Bosnia and Herzegovina'},
  {key: 'Botswana', text: 'Botswana'},
  {key: 'Bouvet Island', text: 'Bouvet Island'},
  {key: 'Brazil', text: 'Brazil'},
  {key: 'British Indian Ocean Territory', text: 'British Indian Ocean Territory'},
  {key: 'Brunei Darussalam', text: 'Brunei Darussalam'},
  {key: 'Bulgaria', text: 'Bulgaria'},
  {key: 'Burkina Faso', text: 'Burkina Faso'},
  {key: 'Burundi', text: 'Burundi'},
  {key: 'Cambodia', text: 'Cambodia'},
  {key: 'Cameroon', text: 'Cameroon'},
  {key: 'Canada', text: 'Canada'},
  {key: 'Cape Verde', text: 'Cape Verde'},
  {key: 'Cayman Islands', text: 'Cayman Islands'},
  {key: 'Central African Republic', text: 'Central African Republic'},
  {key: 'Chad', text: 'Chad'},
  {key: 'Chile', text: 'Chile'},
  {key: 'China', text: 'China'},
  {key: 'Christmas Island', text: 'Christmas Island'},
  {key: 'Cocos (Keeling) Islands', text: 'Cocos (Keeling) Islands'},
  {key: 'Colombia', text: 'Colombia'},
  {key: 'Comoros', text: 'Comoros'},
  {key: 'Congo', text: 'Congo'},
  {key: 'Congo, The Democratic Republic of the', text: 'Congo, The Democratic Republic of the'},
  {key: 'Cook Islands', text: 'Cook Islands'},
  {key: 'Costa Rica', text: 'Costa Rica'},
  {key: 'Cote D\'Ivoire', text: 'Cote D\'Ivoire'},
  {key: 'Croatia', text: 'Croatia'},
  {key: 'Cuba', text: 'Cuba'},
  {key: 'Cyprus', text: 'Cyprus'},
  {key: 'Czech Republic', text: 'Czech Republic'},
  {key: 'Denmark', text: 'Denmark'},
  {key: 'Djibouti', text: 'Djibouti'},
  {key: 'Dominica', text: 'Dominica'},
  {key: 'Dominican Republic', text: 'Dominican Republic'},
  {key: 'Ecuador', text: 'Ecuador'},
  {key: 'Egypt', text: 'Egypt'},
  {key: 'El Salvador', text: 'El Salvador'},
  {key: 'Equatorial Guinea', text: 'Equatorial Guinea'},
  {key: 'Eritrea', text: 'Eritrea'},
  {key: 'Estonia', text: 'Estonia'},
  {key: 'Ethiopia', text: 'Ethiopia'},
  {key: 'Falkland Islands (Malvinas)', text: 'Falkland Islands (Malvinas)'},
  {key: 'Faroe Islands', text: 'Faroe Islands'},
  {key: 'Fiji', text: 'Fiji'},
  {key: 'Finland', text: 'Finland'},
  {key: 'France', text: 'France'},
  {key: 'French Guiana', text: 'French Guiana'},
  {key: 'French Polynesia', text: 'French Polynesia'},
  {key: 'French Southern Territories', text: 'French Southern Territories'},
  {key: 'Gabon', text: 'Gabon'},
  {key: 'Gambia', text: 'Gambia'},
  {key: 'Georgia', text: 'Georgia'},
  {key: 'Germany', text: 'Germany'},
  {key: 'Ghana', text: 'Ghana'},
  {key: 'Gibraltar', text: 'Gibraltar'},
  {key: 'Greece', text: 'Greece'},
  {key: 'Greenland', text: 'Greenland'},
  {key: 'Grenada', text: 'Grenada'},
  {key: 'Guadeloupe', text: 'Guadeloupe'},
  {key: 'Guam', text: 'Guam'},
  {key: 'Guatemala', text: 'Guatemala'},
  {key: 'Guernsey', text: 'Guernsey'},
  {key: 'Guinea', text: 'Guinea'},
  {key: 'Guinea-Bissau', text: 'Guinea-Bissau'},
  {key: 'Guyana', text: 'Guyana'},
  {key: 'Haiti', text: 'Haiti'},
  {key: 'Heard Island and Mcdonald Islands', text: 'Heard Island and Mcdonald Islands'},
  {key: 'Holy See (Vatican City State)', text: 'Holy See (Vatican City State)'},
  {key: 'Honduras', text: 'Honduras'},
  {key: 'Hong Kong', text: 'Hong Kong'},
  {key: 'Hungary', text: 'Hungary'},
  {key: 'Iceland', text: 'Iceland'},
  {key: 'India', text: 'India'},
  {key: 'Indonesia', text: 'Indonesia'},
  {key: 'Iran, Islamic Republic Of', text: 'Iran, Islamic Republic Of'},
  {key: 'Iraq', text: 'Iraq'},
  {key: 'Isle of Man', text: 'Isle of Man'},
  {key: 'Israel', text: 'Israel'},
  {key: 'Italy', text: 'Italy'},
  {key: 'Jamaica', text: 'Jamaica'},
  {key: 'Japan', text: 'Japan'},
  {key: 'Jersey', text: 'Jersey'},
  {key: 'Jordan', text: 'Jordan'},
  {key: 'Kazakhstan', text: 'Kazakhstan'},
  {key: 'Kenya', text: 'Kenya'},
  {key: 'Kiribati', text: 'Kiribati'},
  {key: 'Korea, Democratic People\'S Republic of', text: 'Korea, Democratic People\'S Republic of'},
  {key: 'Korea, Republic of', text: 'Korea, Republic of'},
  {key: 'Kuwait', text: 'Kuwait'},
  {key: 'Kyrgyzstan', text: 'Kyrgyzstan'},
  {key: 'Lao People\'S Democratic Republic', text: 'Lao People\'S Democratic Republic'},
  {key: 'Latvia', text: 'Latvia'},
  {key: 'Lebanon', text: 'Lebanon'},
  {key: 'Lesotho', text: 'Lesotho'},
  {key: 'Liberia', text: 'Liberia'},
  {key: 'Libyan Arab Jamahiriya', text: 'Libyan Arab Jamahiriya'},
  {key: 'Liechtenstein', text: 'Liechtenstein'},
  {key: 'Lithuania', text: 'Lithuania'},
  {key: 'Luxembourg', text: 'Luxembourg'},
  {key: 'Macao', text: 'Macao'},
  {key: 'Macedonia, The Former Yugoslav Republic of', text: 'Macedonia, The Former Yugoslav Republic of'},
  {key: 'Madagascar', text: 'Madagascar'},
  {key: 'Malawi', text: 'Malawi'},
  {key: 'Malaysia', text: 'Malaysia'},
  {key: 'Maldives', text: 'Maldives'},
  {key: 'Mali', text: 'Mali'},
  {key: 'Malta', text: 'Malta'},
  {key: 'Marshall Islands', text: 'Marshall Islands'},
  {key: 'Martinique', text: 'Martinique'},
  {key: 'Mauritania', text: 'Mauritania'},
  {key: 'Mauritius', text: 'Mauritius'},
  {key: 'Mayotte', text: 'Mayotte'},
  {key: 'Mexico', text: 'Mexico'},
  {key: 'Micronesia, Federated States of', text: 'Micronesia, Federated States of'},
  {key: 'Moldova, Republic of', text: 'Moldova, Republic of'},
  {key: 'Monaco', text: 'Monaco'},
  {key: 'Mongolia', text: 'Mongolia'},
  {key: 'Montserrat', text: 'Montserrat'},
  {key: 'Morocco', text: 'Morocco'},
  {key: 'Mozambique', text: 'Mozambique'},
  {key: 'Myanmar', text: 'Myanmar'},
  {key: 'Namibia', text: 'Namibia'},
  {key: 'Nauru', text: 'Nauru'},
  {key: 'Nepal', text: 'Nepal'},
  {key: 'Netherlands', text: 'Netherlands'},
  {key: 'Netherlands Antilles', text: 'Netherlands Antilles'},
  {key: 'New Caledonia', text: 'New Caledonia'},
  {key: 'New Zealand', text: 'New Zealand'},
  {key: 'Nicaragua', text: 'Nicaragua'},
  {key: 'Niger', text: 'Niger'},
  {key: 'Nigeria', text: 'Nigeria'},
  {key: 'Niue', text: 'Niue'},
  {key: 'Norfolk Island', text: 'Norfolk Island'},
  {key: 'Northern Mariana Islands', text: 'Northern Mariana Islands'},
  {key: 'Norway', text: 'Norway'},
  {key: 'Oman', text: 'Oman'},
  {key: 'Pakistan', text: 'Pakistan'},
  {key: 'Palau', text: 'Palau'},
  {key: 'Palestinian Territory, Occupied', text: 'Palestinian Territory, Occupied'},
  {key: 'Panama', text: 'Panama'},
  {key: 'Papua New Guinea', text: 'Papua New Guinea'},
  {key: 'Paraguay', text: 'Paraguay'},
  {key: 'Peru', text: 'Peru'},
  {key: 'Philippines', text: 'Philippines'},
  {key: 'Pitcairn', text: 'Pitcairn'},
  {key: 'Poland', text: 'Poland'},
  {key: 'Portugal', text: 'Portugal'},
  {key: 'Puerto Rico', text: 'Puerto Rico'},
  {key: 'Qatar', text: 'Qatar'},
  {key: 'Reunion', text: 'Reunion'},
  {key: 'Romania', text: 'Romania'},
  {key: 'Russian Federation', text: 'Russian Federation'},
  {key: 'RWANDA', text: 'RWANDA'},
  {key: 'Saint Helena', text: 'Saint Helena'},
  {key: 'Saint Kitts and Nevis', text: 'Saint Kitts and Nevis'},
  {key: 'Saint Lucia', text: 'Saint Lucia'},
  {key: 'Saint Pierre and Miquelon', text: 'Saint Pierre and Miquelon'},
  {key: 'Saint Vincent and the Grenadines', text: 'Saint Vincent and the Grenadines'},
  {key: 'Samoa', text: 'Samoa'},
  {key: 'San Marino', text: 'San Marino'},
  {key: 'Sao Tome and Principe', text: 'Sao Tome and Principe'},
  {key: 'Saudi Arabia', text: 'Saudi Arabia'},
  {key: 'Senegal', text: 'Senegal'},
  {key: 'Serbia and Montenegro', text: 'Serbia and Montenegro'},
  {key: 'Seychelles', text: 'Seychelles'},
  {key: 'Sierra Leone', text: 'Sierra Leone'},
  {key: 'Singapore', text: 'Singapore'},
  {key: 'Slovakia', text: 'Slovakia'},
  {key: 'Slovenia', text: 'Slovenia'},
  {key: 'Solomon Islands', text: 'Solomon Islands'},
  {key: 'Somalia', text: 'Somalia'},
  {key: 'South Africa', text: 'South Africa'},
  {key: 'South Georgia and the South Sandwich Islands', text: 'South Georgia and the South Sandwich Islands'},
  {key: 'Spain', text: 'Spain'},
  {key: 'Sri Lanka', text: 'Sri Lanka'},
  {key: 'Sudan', text: 'Sudan'},
  {key: 'Suriname', text: 'Suriname'},
  {key: 'Svalbard and Jan Mayen', text: 'Svalbard and Jan Mayen'},
  {key: 'Swaziland', text: 'Swaziland'},
  {key: 'Sweden', text: 'Sweden'},
  {key: 'Switzerland', text: 'Switzerland'},
  {key: 'Syrian Arab Republic', text: 'Syrian Arab Republic'},
  {key: 'Taiwan, Province of China', text: 'Taiwan, Province of China'},
  {key: 'Tajikistan', text: 'Tajikistan'},
  {key: 'Tanzania, United Republic of', text: 'Tanzania, United Republic of'},
  {key: 'Thailand', text: 'Thailand'},
  {key: 'Timor-Leste', text: 'Timor-Leste'},
  {key: 'Togo', text: 'Togo'},
  {key: 'Tokelau', text: 'Tokelau'},
  {key: 'Tonga', text: 'Tonga'},
  {key: 'Trinidad and Tobago', text: 'Trinidad and Tobago'},
  {key: 'Tunisia', text: 'Tunisia'},
  {key: 'Turkey', text: 'Turkey'},
  {key: 'Turkmenistan', text: 'Turkmenistan'},
  {key: 'Turks and Caicos Islands', text: 'Turks and Caicos Islands'},
  {key: 'Tuvalu', text: 'Tuvalu'},
  {key: 'Uganda', text: 'Uganda'},
  {key: 'Ukraine', text: 'Ukraine'},
  {key: 'United Arab Emirates', text: 'United Arab Emirates'},
  {key: 'United States', text: 'United States'},
  {key: 'United States Minor Outlying Islands', text: 'United States Minor Outlying Islands'},
  {key: 'Uruguay', text: 'Uruguay'},
  {key: 'Uzbekistan', text: 'Uzbekistan'},
  {key: 'Vanuatu', text: 'Vanuatu'},
  {key: 'Venezuela', text: 'Venezuela'},
  {key: 'Viet Nam', text: 'Viet Nam'},
  {key: 'Virgin Islands, British', text: 'Virgin Islands, British'},
  {key: 'Virgin Islands, U.S.', text: 'Virgin Islands, U.S.'},
  {key: 'Wallis and Futuna', text: 'Wallis and Futuna'},
  {key: 'Western Sahara', text: 'Western Sahara'},
  {key: 'Yemen', text: 'Yemen'},
  {key: 'Zambia', text: 'Zambia'},
  {key: 'Zimbabwe', text: 'Zimbabwe'},
];

const jurisdictionOptions = [
  {key: 'local', text: 'Local' },
  {key: 'regional', text: 'Regional' },
  {key: 'national', text: 'National' },
  {key: 'transnational', text: 'Transnational' },
];

const functionOptions = [
  {key: 'Offending location', text: 'Offending location' },
  {key: 'Meeting', text: 'Meeting' },
  {key: 'Storage', text: 'Storage' },
  {key: 'Hideaway', text: 'Hideaway' },
  {key: 'Unknown', text: 'Unknown' },
];

const AddLocationForm = ({
  toggleHideDialog,
  hideDialog,
}) => {
  const [cy, cyActions] = useCytoscape();

  const handleFormSubmit = (formData) => {
    console.log('form submitted', formData);
    cy.add({
      group: 'nodes',
      data: {
        type: 'location',
        ...formData
      },
    });

    cyActions.runLayout();
    toggleHideDialog();
    return true;
  }

  const initialValues = {
    name: '',
    location: 'N/A',
    jurisdiction: 'local',
    function: ''
  };

  const validate = (values) => {
    console.log('validate', values);
    const errors = {};

    if (!values.name) {
      errors.name = 'Please enter a name'
    }

    if (!values.function) {
      errors.function = 'Please select a function'
    }

    return errors
  }

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Add a Location',
      }}
      modalProps={{
        isBlocking: true, // Makes background click close dialog
      }}
      maxWidth="500px" // Default is too narrow - could use grid size?
      minWidth="500px"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validate={validate}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
        <Form>
          <Field
            name="name"
            label="Name (or type) of location [e.g. 'Stoke'/'playground'/'online platform']"
            placeholder="Enter a location name or type"
            component={FormikTextField}
          />
          <Field
            name="location"
            label="Geographical location"
            placeholder="Select a location"
            component={FormikDropdown}
            options={locationOptions}
          />
          <Field
            name="jurisdiction"
            label="Jurisdiction"
            placeholder="Select a jurisdiction"
            component={FormikDropdown}
            options={jurisdictionOptions}
          />
          <Field
            name="function"
            label="Function"
            component={FormikDropdown}
            options={functionOptions}
          />
          <DialogFooter>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
            <PrimaryButton type="submit" text="Add to Network" />
          </DialogFooter>
        </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddLocationForm;
