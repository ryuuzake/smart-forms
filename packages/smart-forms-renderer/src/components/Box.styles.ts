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

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

export const QGroupContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'cardElevation' && prop !== 'isRepeated'
})<{ cardElevation: number; isRepeated: boolean }>(({ cardElevation, isRepeated }) => ({
  marginTop: cardElevation === 1 || isRepeated ? 0 : 18,
  marginBottom: cardElevation === 1 || isRepeated ? 0 : 18
}));

export const FullWidthFormComponentBox = styled(Box)(() => ({
  marginBottom: 10
}));

export const FormTitleWrapper = styled(Box)(() => ({
  marginTop: 12
}));

export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  height: 34
}));
