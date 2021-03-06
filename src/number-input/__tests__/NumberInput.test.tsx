import * as React from "react";
import {
  axe,
  press,
  click,
  screen,
  render,
  fireEvent,
} from "reakit-test-utils";
import { cleanup } from "@testing-library/react";

import {
  NumberInput,
  useNumberInputState,
  NumberInputDecrementButton,
  NumberInputIncrementButton,
} from "../index";
import { AppProps } from "../stories/NumberInput.component";
import { repeat } from "../../utils/test-utils";

afterEach(cleanup);

const NumberInputComp = (props: AppProps) => {
  const state = useNumberInputState(props);
  const { clampValueOnBlur, allowMouseWheel } = props;

  return (
    <label htmlFor="numberinput">
      <NumberInputDecrementButton data-testid="dec" {...state}>
        -
      </NumberInputDecrementButton>
      <NumberInput
        id="numberinput"
        data-testid="numberinput"
        aria-label="Number Input"
        clampValueOnBlur={clampValueOnBlur}
        allowMouseWheel={allowMouseWheel}
        {...state}
      />
      <NumberInputIncrementButton data-testid="inc" {...state}>
        +
      </NumberInputIncrementButton>
    </label>
  );
};

describe("NumberInput", () => {
  it("should render correctly", () => {
    render(<NumberInputComp defaultValue={0} />);

    const numberInput = screen.getByTestId("numberinput");

    expect(numberInput).not.toHaveFocus();
    press.Tab();
    expect(numberInput).toHaveFocus();
  });

  it("should increase/decrease with keyboard", () => {
    render(<NumberInputComp defaultValue={0} max={10} min={0} />);
    const numberInput = screen.getByTestId("numberinput");

    expect(numberInput).not.toHaveFocus();
    press.Tab();
    expect(numberInput).toHaveFocus();
    expect(numberInput).toHaveValue("0");

    repeat(press.ArrowUp, 3);
    expect(numberInput).toHaveValue("3");

    repeat(press.ArrowDown, 3);
    expect(numberInput).toHaveValue("0");

    press.ArrowUp();
    expect(numberInput).toHaveValue("1");

    press.Home();
    expect(numberInput).toHaveValue("0");

    press.End();
    expect(numberInput).toHaveValue("10");
  });

  it("should increase/decrease with buttons", () => {
    render(<NumberInputComp defaultValue={0} />);

    const incBtn = screen.getByTestId("inc");
    const decBtn = screen.getByTestId("dec");
    const numberInput = screen.getByTestId("numberinput");

    expect(numberInput).not.toHaveFocus();
    press.Tab();
    expect(numberInput).toHaveFocus();
    expect(numberInput).toHaveValue("0");
    repeat(() => click(incBtn), 3);
    expect(numberInput).toHaveValue("3");
    repeat(() => click(decBtn), 3);
    expect(numberInput).toHaveValue("0");
  });

  it("should increase/decrease with scrollwheel", () => {
    render(<NumberInputComp defaultValue={0} />);
    const numberInput = screen.getByTestId("numberinput");

    press.Tab();
    expect(numberInput).toHaveFocus();
    expect(numberInput).toHaveValue("0");

    fireEvent.wheel(numberInput, { deltaY: -100 });
    fireEvent.wheel(numberInput, { deltaY: -100 });
    expect(numberInput).toHaveValue("2");

    fireEvent.wheel(numberInput, { deltaY: 100 });
    fireEvent.wheel(numberInput, { deltaY: 100 });
    expect(numberInput).toHaveValue("0");
  });

  it("should behave properly with min/max/step options", () => {
    render(<NumberInputComp defaultValue={0} min={10} max={50} step={10} />);

    const incBtn = screen.getByTestId("inc");
    const decBtn = screen.getByTestId("dec");
    const numberInput = screen.getByTestId("numberinput");

    press.Tab();
    expect(numberInput).toHaveFocus();
    // 3 times pressing wont matter since min value is 10
    repeat(() => click(decBtn), 3);
    expect(numberInput).toHaveValue("10");

    click(incBtn);
    // step is 10
    expect(numberInput).toHaveValue("20");
    click(incBtn);
    expect(numberInput).toHaveValue("30");
    click(incBtn);
    expect(numberInput).toHaveValue("40");
    click(incBtn);
    expect(numberInput).toHaveValue("50");
    // 3 times pressing wont matter since max value is 50
    repeat(() => click(incBtn), 3);
    expect(numberInput).toHaveValue("50");
  });

  it("should behave properly precision value", () => {
    render(<NumberInputComp defaultValue={0} step={0.65} precision={2} />);

    const incBtn = screen.getByTestId("inc");
    const decBtn = screen.getByTestId("dec");
    const numberInput = screen.getByTestId("numberinput");

    press.Tab();
    expect(numberInput).toHaveFocus();
    expect(numberInput).toHaveValue("0.00");
    click(incBtn);
    expect(numberInput).toHaveValue("0.65");
    click(incBtn);
    expect(numberInput).toHaveValue("1.30");
    click(incBtn);
    expect(numberInput).toHaveValue("1.95");
    click(decBtn);
    expect(numberInput).toHaveValue("1.30");
  });

  it("should behave properly clampValueOnBlur/keepWithinRange", () => {
    // note clampValueOnBlur/keepWithinRange is true by default
    render(
      <NumberInputComp
        clampValueOnBlur={true}
        keepWithinRange={true}
        defaultValue={15}
        min={10}
        max={50}
      />,
    );
    const numberInput = screen.getByTestId("numberinput");

    press.Tab();
    expect(numberInput).toHaveFocus();
    expect(numberInput).toHaveValue("15");

    fireEvent.change(numberInput, { target: { value: "25" } });
    expect(numberInput).toHaveValue("25");

    fireEvent.change(numberInput, { target: { value: "999999" } });
    click(document.body); // blur
    expect(numberInput).not.toHaveFocus();
    expect(numberInput).toHaveValue("50");

    press.Tab(); // get back focus
    fireEvent.change(numberInput, { target: { value: "0" } });
    click(document.body); // blur
    expect(numberInput).not.toHaveFocus();
    expect(numberInput).toHaveValue("10");
  });

  test("NumberInput renders with no a11y violations", async () => {
    const { container } = render(<NumberInputComp />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
