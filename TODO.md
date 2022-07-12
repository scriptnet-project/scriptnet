# TODO List
Refactor modes concept

- Use legend to create nodes and edges? When in edit mode, clicking legend item could trigger action and mark it as selected

- Two fundamental "modes" (views): (1) editing, (2) visualising.
- Editing mode:
  - Editing mode is the default mode.
  - When editing, show an "edit toolbar" which allows adding a node, creating edges, and assigning scenes.
- Visualising mode:
  - Includes specific visualisations:
    - Scenes
    - Relationships
    - Focal Individual
    - Jurisdictions
  - Legend should allow toggling relevant properties. I.e Scenes, Relationships.
  - When in visualising mode, show a "visualisation toolbar" which allows switching between visualisations.
  - Also enable switching between layout based on coordinates or based on map
  - Also allow filtering based on period of involvement.
    - Filtering component is a two-way slider which automatically detects start and end date ranges

## Current

- complete location picker as inline component in details panel. use build in search box - don't try to recreate
## Missing big features

- Geographic visualisation
- Temporal visualisation of actors added to existing visualisations
- Refactor modes
- refactor toolbars
- delete edges
- entities all have gender
- Fix all existing entity forms

## Backlog

- Create "delete" section within details panel (move button from bottom footer)
- Remove bottom footer
- Add scene assignment to details panel
- Fix visualisation side panels
- zindex issue for map search results
