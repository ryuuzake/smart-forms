/*
 * Copyright 2024 Commonwealth Scientific and Industrial Research
 * Organisation (CSIRO) ABN 41 687 119 230.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Meta, StoryObj } from '@storybook/react';
import BuildFormWrapper from './BuildFormWrapper';
import {
  qEnableBehaviorAll,
  qEnableBehaviorAny,
  qEnableWhen,
  qEnableWhenExpressionSimple,
  qEnableWhenExpressionTabs,
  qInitialRepeats,
  qInitialSingle,
  qText
} from '@aehrc/smart-forms-questionnaire-samples';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Component/9.1.4 Form Behavior Other Control',
  component: BuildFormWrapper,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: []
} satisfies Meta<typeof BuildFormWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const InitialSingle: Story = {
  args: {
    questionnaire: qInitialSingle
  }
};

export const InitialRepeats: Story = {
  args: {
    questionnaire: qInitialRepeats
  }
};

export const EnableWhen: Story = {
  args: {
    questionnaire: qEnableWhen
  }
};

export const EnableBehaviorAll: Story = {
  args: {
    questionnaire: qEnableBehaviorAll
  }
};

export const EnableBehaviorAny: Story = {
  args: {
    questionnaire: qEnableBehaviorAny
  }
};

export const EnableWhenExpressionSimple: Story = {
  args: {
    questionnaire: qEnableWhenExpressionSimple
  }
};

export const EnableWhenExpressionTabs: Story = {
  args: {
    questionnaire: qEnableWhenExpressionTabs
  }
};

export const Text: Story = {
  args: {
    questionnaire: qText
  }
};
