import React from "react";
import { Meta } from "@storybook/react";

import { App as Toast } from "./ToastBasic.component";
import { toastBasicTemplate, toastBasicTemplateJs } from "./templates";
import { createPreviewTabs } from "../../../scripts/create-preview-tabs";

export default {
  component: Toast,
  title: "Toast/Basic",
  parameters: {
    preview: createPreviewTabs({
      js: toastBasicTemplateJs,
      ts: toastBasicTemplate,
    }),
  },
} as Meta;

export const Default = () => <Toast />;
