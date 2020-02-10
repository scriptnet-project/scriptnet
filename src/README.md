## General features

- Modules can be included with absolute paths from src:
  `import App from 'components/App';`

-

## components/

React components go here.

- Assets (scss/images) should exist alongside components.
- Self contained components should have their own directory,
  for example:

  ```
  src/components/App/
  src/components/App/index.js
  src/components/App/App.js
  src/components/App/App.scss
  src/components/App/logo.svg
  ```

  which can be imported as:

  `import App from 'components/App';`

## store/

Redux reducers go here

## store/selectors

State selectors go here
