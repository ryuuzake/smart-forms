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

import React, { memo, useCallback, useState } from 'react';
import { Grid } from '@mui/material';

import {
  PropsWithIsRepeatedAttribute,
  PropsWithIsTabledAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../interfaces/Interfaces';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createEmptyQrItem } from '../../../../functions/QrItemFunctions';
import { getTextDisplayPrompt } from '../../../../functions/QItemFunctions';
import QItemDisplayInstructions from './QItemDisplayInstructions';
import QItemLabel from '../QItemParts/QItemLabel';
import { StandardTextField } from '../../../StyledComponents/Textfield.styles';
import { FullWidthFormComponentBox } from '../../../StyledComponents/Boxes.styles';
import { debounce } from 'lodash';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute,
    PropsWithIsTabledAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemString(props: Props) {
  const { qItem, qrItem, isRepeated, isTabled, onQrItemChange } = props;

  const qrString = qrItem ? qrItem : createEmptyQrItem(qItem);
  const valueString = qrString['answer'] ? qrString['answer'][0].valueString : '';

  const [input, setInput] = useState<string | undefined>(valueString);

  let hasError = false;
  if (qItem.maxLength && valueString) {
    hasError = valueString.length > qItem.maxLength;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newInput = event.target.value;
    setInput(newInput);
    updateQrItemWithDebounce(newInput);
  }

  const updateQrItemWithDebounce = useCallback(
    debounce((input: string) => {
      if (input !== '') {
        onQrItemChange({ ...qrString, answer: [{ valueString: input }] });
      } else {
        onQrItemChange(createEmptyQrItem(qItem));
      }
    }, 300),
    [onQrItemChange, qrString]
  );

  const stringInput = (
    <StandardTextField
      fullWidth
      isTabled={isTabled}
      error={hasError}
      id={qItem.linkId}
      value={input}
      onChange={handleChange}
      label={getTextDisplayPrompt(qItem)}
      helperText={hasError && qItem.maxLength ? `${qItem.maxLength} character limit exceeded` : ''}
      data-test="q-item-string-field"
    />
  );

  const renderQItemString = isRepeated ? (
    <>{stringInput}</>
  ) : (
    <FullWidthFormComponentBox data-test="q-item-string-box">
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          {stringInput}
          <QItemDisplayInstructions qItem={qItem} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );

  return <>{renderQItemString}</>;
}

export default memo(QItemString);
