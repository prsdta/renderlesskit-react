import * as React from "react";
import { VisuallyHidden } from "reakit";

import {
  useSliderState,
  SliderTrack,
  SliderThumb,
  SliderInput,
} from "renderless-components";

interface AppProps {
  /**
   * Label for the slider
   *
   * @default Styled
   */
  label?: string;
  /**
   * True, if thumb needs a tip to show it's current percent
   */
  showTip?: boolean;
  /**
   * Origin on the slider, calculated based on min & max
   */
  origin?: number;
  /**
   * The `value` of the slider indicator.
   *
   * If `undefined`/`not valid` the slider bar will be the optimum of min & max
   * @default [50]
   */
  values?: number[];
  /**
   * The minimum value of the slider
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the slider
   * @default 100
   */
  max?: number;
  /**
   * The step in which increments/decrements have to be made
   * @default 1
   */
  step?: number;
  /**
   * If `true`, the slider will be disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Orientation of the slider
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Direction of the slider
   * @default false
   */
  reversed?: boolean;
  /**
   * True, if the direction of the slider is reversed
   * @default false
   */
  isReversed?: boolean;
  /**
   * Get the formated value based on number format options
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * Get the value when it changes
   */
  onChange?: (values: number[]) => void;
  /**
   * Get the value when dragging is started
   */
  onChangeEnd?: (value: number[]) => void;
  /**
   * Get the value when dragging is stopped
   */
  onChangeStart?: (value: number[]) => void;
}

export const App: React.FC<AppProps> = args => {
  const { label, isReversed, origin: originProp, onChange, ...rest } = args;
  const origin = originProp ?? args.min ?? 0;

  const state = useSliderState({ reversed: isReversed, ...rest });
  const {
    values,
    getValuePercent,
    getThumbValueLabel,
    getThumbPercent,
  } = state;

  const isVertical = args.orientation === "vertical";
  const isRange = values.length === 2;
  const isMulti = values.length > 2;

  const labelValue = !isRange
    ? getThumbValueLabel(0)
    : `${state.getThumbValueLabel(0)} to ${state.getThumbValueLabel(1)}`;
  const trackWidth = !isRange
    ? `${
        (getValuePercent(Math.max(values[0], origin)) -
          getValuePercent(Math.min(values[0], origin))) *
        100
      }%`
    : `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`;
  const trackLeft = !isRange
    ? `${getValuePercent(Math.min(values[0], origin)) * 100}%`
    : `${getThumbPercent(0) * 100}%`;
  const trackRight = !isRange ? "0px" : `${getThumbPercent(0) * 100}%`;

  React.useEffect(() => {
    onChange?.(values);
  }, [onChange, values]);

  return (
    <div
      className="chakra-slider-group"
      role="group"
      aria-labelledby="styled-slider"
    >
      <div className="slider-label">
        <label className="label" id="styled-slider">
          {`${args.label ? args.label : "Styled"} Slider`}
        </label>
        <div className="value">
          {!isMulti ? labelValue : JSON.stringify(state.values)}
        </div>
      </div>

      <div className={`slider ${isVertical ? "vertical" : ""}`}>
        <SliderTrack {...state} className="slider-track-container">
          <div className="slider-track" />
          {!isMulti ? (
            <div
              className="slider-filled-track"
              style={{
                width: !isVertical ? trackWidth : "",
                height: isVertical ? trackWidth : "",
                left: !isReversed && !isVertical && trackLeft ? trackLeft : "",
                right: isReversed ? trackRight : "",
                bottom:
                  isVertical && isRange ? `${getThumbPercent(0) * 100}%` : "",
              }}
            />
          ) : null}
        </SliderTrack>

        {[...new Array(values.length).keys()].map(index => {
          return (
            <div
              className="slider-thumb"
              key={`thumb-${index}`}
              style={{
                right: isReversed
                  ? `calc(${getThumbPercent(index) * 100}% - 7px)`
                  : "",
                left:
                  !isReversed && !isVertical
                    ? `calc(${getThumbPercent(index) * 100}% - 7px)`
                    : "",
                bottom: isVertical
                  ? `calc(${getThumbPercent(index) * 100}% - 7px)`
                  : "",
              }}
            >
              <SliderThumb
                {...state}
                index={index}
                className="slider-thumb-handle"
              >
                <VisuallyHidden>
                  <SliderInput
                    index={index}
                    aria-label={`Thumb-${index}`}
                    aria-labelledby="styled-slider"
                    {...state}
                  />
                </VisuallyHidden>
              </SliderThumb>
              {args.showTip && (
                <div className="slider-thumb-tip">
                  {getThumbValueLabel(index)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
