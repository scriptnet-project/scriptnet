import React from "react";

let lsBus = {};
let ssBus = {};

/**
 * Redraw all components that have a hook to localStorage with the given key.
 * @param {string} key
 * @param {*} newValue
 */
const notifyLSBus = (key, newValue) => {
    if (!lsBus || !lsBus[key]) {
        return;
    }
    Object.values(lsBus[key]).forEach(u => u(newValue));
};

/**
 * Redraw all components that have a hook to sessionStorage with the given key.
 * @param {string} key
 * @param {*} newValue
 */
const notifySSBus = (key, newValue) => {
    if (!ssBus || !ssBus[key]) {
        return;
    }
    Object.values(ssBus[key]).forEach(u => u(newValue));
};

export const useSessionStorage = (key, initialValue) => {
  let defaultValue;
  try {
      defaultValue = sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : initialValue;
  } catch (e) {
      defaultValue = initialValue;
  }
  const [value, setValue] = React.useState(defaultValue);
  const componentId = React.useState(Math.random().toString())[0];

  React.useEffect(() => {
      ssBus[key] = ssBus[key] || {};
      ssBus[key][componentId] = setValue;
      return () => delete ssBus[componentId];
  });

  return [
      value,
      (newValue) => {
          sessionStorage.setItem(key, JSON.stringify(newValue));
          notifySSBus(key, newValue);
      }
  ];
};
