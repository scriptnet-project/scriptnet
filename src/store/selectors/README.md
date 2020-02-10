# Store/Selectors

Store selectors belong here. A memoised reselect selector is not
necessary unless performance optimisations need to be made.

e.g.

```
const getFoo = (state) => ({
  // selected properties go here
});

or

const getFoo = (args) => (state) => ({
  // selected properties go here
});
```
