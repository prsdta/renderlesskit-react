// Automatically generated
const SLIDER_STATE_KEYS = [
  "values",
  "min",
  "max",
  "step",
  "isDisabled",
  "orientation",
  "reversed",
  "trackRef",
  "focusedThumb",
  "getThumbValue",
  "getValuePercent",
  "getThumbPercent",
  "getThumbMinValue",
  "getThumbMaxValue",
  "getFormattedValue",
  "getThumbValueLabel",
  "getPercentValue",
  "isThumbEditable",
  "isThumbDragging",
  "inputs",
  "registerInput",
  "unregisterInput",
  "setFocusedThumb",
  "setThumbValue",
  "setThumbPercent",
  "setThumbEditable",
  "setThumbDragging",
] as const;
export const SLIDER_INPUT_KEYS = [...SLIDER_STATE_KEYS, "index"] as const;
export const SLIDER_THUMB_KEYS = SLIDER_INPUT_KEYS;
export const SLIDER_TRACK_KEYS = SLIDER_STATE_KEYS;
