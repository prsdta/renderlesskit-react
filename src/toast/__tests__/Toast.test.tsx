import * as React from "react";
import { axe, render, click, act, screen } from "reakit-test-utils";

import { useToast, ToastProvider } from "..";

beforeEach(() => {
  jest.useFakeTimers();
  jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb: any) => cb());
  jest.spyOn(window, "setTimeout").mockImplementation((cb: any) => cb());
});

afterEach(() => {
  (window.requestAnimationFrame as any).mockRestore();
  (window.setTimeout as any).mockRestore();
});

const Demo = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button
        onClick={() => {
          showToast({
            type: "error",
            content: "This is error",
          });
        }}
      >
        Error button
      </button>
      <button
        onClick={() => {
          showToast({ type: "success", content: "This is success" });
        }}
      >
        Success button
      </button>
      <button
        onClick={() => {
          showToast({ type: "warning", content: "This is warning" });
        }}
      >
        Warning button
      </button>
      <button
        onClick={() => {
          showToast({
            content: () => (
              <p style={{ fontFamily: "Impact", color: "black" }}>
                This is Custom
              </p>
            ),
          });
        }}
      >
        Custom button
      </button>
    </div>
  );
};

const ToastComp: React.FC = () => {
  return (
    <ToastProvider
      placement="bottom-center"
      toastTypes={{
        error: ({ hideToast, content, id }) => {
          return (
            <div
              data-testid="error-toast"
              className="toast"
              style={{ backgroundColor: "#f02c2d" }}
            >
              {content}{" "}
              <button data-testid="error-close" onClick={() => hideToast(id)}>
                x
              </button>
            </div>
          );
        },
        success: ({ hideToast, content, id }) => {
          return (
            <div className="toast" style={{ backgroundColor: "#01c24e" }}>
              {content} <button onClick={() => hideToast(id)}>x</button>
            </div>
          );
        },
        warning: ({ hideToast, content, id }) => {
          return (
            <div className="toast" style={{ backgroundColor: "#ef5013" }}>
              {content} <button onClick={() => hideToast(id)}>x</button>
            </div>
          );
        },
      }}
    >
      <Demo />
    </ToastProvider>
  );
};

describe("Toast", () => {
  it("should render correctly", () => {
    const { baseElement } = render(<ToastComp />);

    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div>
            <button>
              Error button
            </button>
            <button>
              Success button
            </button>
            <button>
              Warning button
            </button>
            <button>
              Custom button
            </button>
          </div>
        </div>
      </body>
    `);
  });

  it("toast should popup to the screen after click", () => {
    render(<ToastComp />);

    const errorBtn = screen.getByText("Error button");

    expect(errorBtn).toBeInTheDocument();

    act(() => {
      click(errorBtn);
    });

    expect(screen.getByTestId("error-toast")).toHaveTextContent(
      "This is error",
    );
  });

  it("should be hideToastd after clicking close button", () => {
    render(<ToastComp />);
    const errorBtn = screen.getByText("Error button");

    expect(errorBtn).toBeInTheDocument();

    // add first
    act(() => {
      click(errorBtn);
    });

    expect(screen.getByTestId("error-toast")).toHaveTextContent(
      "This is error",
    );

    // let hideToast now
    act(() => {
      click(screen.getByTestId("error-close"));
    });

    expect(screen.queryByTestId("error-toast")).not.toBeInTheDocument();
  });

  test("Toast renders with no a11y violations", async () => {
    const { container } = render(<ToastComp />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
