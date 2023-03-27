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

import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Fade, Grid, InputAdornment } from '@mui/material';

import type {
  PropsWithIsRepeatedAttribute,
  PropsWithIsTabledAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../../interfaces/Interfaces';
import { CalculatedExpression } from '../../../../../interfaces/Interfaces';
import type { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createEmptyQrItemWithUnit } from '../../../../../functions/QrItemFunctions';
import QItemDisplayInstructions from './QItemDisplayInstructions';
import QItemLabel from '../QItemParts/QItemLabel';
import { FullWidthFormComponentBox } from '../../../../StyledComponents/Boxes.styles';
import { StandardOutlinedInput } from '../../../../StyledComponents/Textfield.styles';
import { debounce } from 'lodash';
import CheckIcon from '@mui/icons-material/Check';
import { CalculatedExpressionContext } from '../../../../../custom-contexts/CalculatedExpressionContext';
import useRenderingExtensions from '../../../../../custom-hooks/useRenderingExtensions';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute,
    PropsWithIsTabledAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemInteger(props: Props) {
  const { qItem, qrItem, isRepeated, isTabled, onQrItemChange } = props;

  const { calculatedExpressions } = useContext(CalculatedExpressionContext);

  const { displayUnit, displayPrompt } = useRenderingExtensions(qItem);

  const calculatedExpression: CalculatedExpression | undefined =
    calculatedExpressions[qItem.linkId];

  let valueInteger = 0;
  if (qrItem && qrItem.answer && qrItem.answer.length && qrItem.answer[0].valueInteger) {
    valueInteger = qrItem.answer[0].valueInteger;
  }

  const [input, setInput] = useState<number>(valueInteger);
  const [calExpIsCalculating, setCalExpIsCalculating] = useState(false);

  useEffect(() => {
    // only update questionnaireResponse if calculated value is different from current value
    if (calculatedExpression?.value !== input && typeof calculatedExpression?.value === 'number') {
      setCalExpIsCalculating(true);
      setTimeout(() => {
        setCalExpIsCalculating(false);
      }, 500);

      setInput(calculatedExpression.value);
      onQrItemChange({
        ...createEmptyQrItemWithUnit(qItem, displayUnit),
        answer: [{ valueInteger: calculatedExpression.value }]
      });
    }
  }, [calculatedExpression]); // Only trigger this effect if calculatedExpression changes

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newInput = event.target.value;

    const hasNumber = /\d/;
    if (!hasNumber.test(newInput)) {
      newInput = '0';
    }

    const inputNumber = parseInt(newInput);
    setInput(inputNumber);
    updateQrItemWithDebounce(inputNumber);
  }

  const updateQrItemWithDebounce = useCallback(
    debounce((inputNumber: number) => {
      onQrItemChange({
        ...createEmptyQrItemWithUnit(qItem, displayUnit),
        answer: [{ valueInteger: inputNumber }]
      });
    }, 200),
    [onQrItemChange, qItem, displayUnit]
  );

  const integerInput = (
    <StandardOutlinedInput
      id={qItem.linkId}
      value={input}
      onChange={handleChange}
      disabled={!!calculatedExpression}
      fullWidth
      isTabled={isTabled}
      label={displayPrompt}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      endAdornment={
        <InputAdornment position={'end'}>
          <Fade in={calExpIsCalculating} timeout={{ enter: 100, exit: 300 }}>
            <CheckIcon color="success" fontSize="small" />
          </Fade>
          {displayUnit}
        </InputAdornment>
      }
      data-test="q-item-integer-field"
    />
  );

  const renderQItemInteger = isRepeated ? (
    <>{integerInput}</>
  ) : (
    <FullWidthFormComponentBox data-test="q-item-integer-box">
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          {integerInput}
          <QItemDisplayInstructions qItem={qItem} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );

  return <>{renderQItemInteger}</>;
}

export default memo(QItemInteger);
