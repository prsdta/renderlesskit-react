import {
  useCompositeItem,
  CompositeItemOptions,
  CompositeItemHTMLProps,
  useButton,
  ButtonHTMLProps,
  ButtonOptions,
} from "reakit";
import * as React from "react";
import { useForkRef } from "reakit-utils";
import { callAllHandlers } from "@chakra-ui/utils";
import { createComponent, createHook } from "reakit-system";

import { TIME_PICKER_COLUMN_VALUE_KEYS } from "./__keys";
import { TimePickerColumnStateReturn } from "./TimePickerColumnState";

export type TimePickerColumnValueOptions = ButtonOptions &
  CompositeItemOptions &
  Pick<
    TimePickerColumnStateReturn,
    "selected" | "move" | "setSelected" | "visible"
  > & {
    value: number;
  };

export type TimePickerColumnValueHTMLProps = ButtonHTMLProps &
  CompositeItemHTMLProps;

export type TimePickerColumnValueProps = TimePickerColumnValueOptions &
  TimePickerColumnValueHTMLProps;

export const useTimePickerColumnValue = createHook<
  TimePickerColumnValueOptions,
  TimePickerColumnValueHTMLProps
>({
  name: "TimePickerColumnValue",
  compose: [useButton, useCompositeItem],
  keys: TIME_PICKER_COLUMN_VALUE_KEYS,

  useProps(options, { ref: htmlRef, onClick: htmlOnClick, ...htmlProps }) {
    const {
      setCurrentId,
      move,
      selected,
      value,
      id,
      setSelected,
      visible,
    } = options;
    const ref = React.useRef<HTMLElement>();

    React.useEffect(() => {
      if (selected === value) {
        if (!id) return;

        setCurrentId?.(id);
        ref?.current?.scrollIntoView();
      }
    }, [id, move, selected, setCurrentId, value, visible]);

    const onClick = React.useCallback(() => {
      setSelected(value);
    }, [setSelected, value]);

    return {
      role: "option",
      "aria-selected": selected == value,
      ref: useForkRef(ref, htmlRef),
      onClick: callAllHandlers(htmlOnClick, onClick),
      ...htmlProps,
    };
  },
});

export const TimePickerColumnValue = createComponent({
  as: "div",
  memo: true,
  useHook: useTimePickerColumnValue,
});
