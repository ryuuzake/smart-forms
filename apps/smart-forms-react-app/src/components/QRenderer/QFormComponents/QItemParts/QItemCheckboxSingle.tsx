/*
 * Copyright 2023 Commonwealth Scientific and Industrial Research
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

import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

interface Props {
  value: string;
  label: string;
  isChecked: boolean;
  onCheckedChange: (value: string) => unknown;
}

function QItemCheckboxSingle(props: Props) {
  const { value, label, isChecked, onCheckedChange } = props;

  return (
    <FormControlLabel
      control={
        <Checkbox size="small" checked={isChecked} onChange={() => onCheckedChange(value)} />
      }
      label={label}
      sx={{ mr: 3 }}
    />
  );
}

export default QItemCheckboxSingle;
