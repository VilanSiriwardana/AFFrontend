import { useState } from "react";

export function useInput(defaultValue, validationFunction) {
  //Local States and Refs
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);
  const [enteredId, setEnteredId] = useState(null);

  // Event Handlers
  function handleInputChange(event) {
    const { type, value, options, selectedIndex, id } = event.target;

    if (type === "select-one") {
      const selectedOptionId = options[selectedIndex].id;
      setEnteredValue(value);
      setEnteredId(selectedOptionId);
    } else {
      setEnteredValue(value);
      setEnteredId(id || null);
    }
    setDidEdit(false);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }

  function reset() {
    setEnteredValue(defaultValue);
    setDidEdit(false);
    setEnteredId(null);
  }

  const valueIsValid = validationFunction(enteredValue);

  return {
    value: enteredValue,
    setValue: setEnteredValue,
    id: enteredId,
    setId: setEnteredId,
    handleInputChange,
    handleInputBlur,
    hasError: didEdit && !valueIsValid,
    reset,
  };
}
