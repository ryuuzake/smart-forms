import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Grid } from '@mui/material';

import {
  PropsWithIsRepeatedAttribute,
  PropsWithIsTabledAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../interfaces/Interfaces';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createQrItem } from '../../../../functions/QrItemFunctions';
import QItemDisplayInstructions from './QItemDisplayInstructions';
import QItemLabel from '../QItemParts/QItemLabel';
import { StandardTextField } from '../../../StyledComponents/Textfield.styles';
import { FullWidthFormComponentBox } from '../../../StyledComponents/Boxes.styles';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute,
    PropsWithIsTabledAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemTime(props: Props) {
  const { qItem, qrItem, isRepeated, isTabled, onQrItemChange } = props;

  const qrTime = qrItem ? qrItem : createQrItem(qItem);
  const answerValue = qrTime['answer'] ? qrTime['answer'][0].valueTime : null;
  const answerValueDayJs = answerValue ? dayjs(answerValue) : null;

  const [value, setValue] = useState<Dayjs | null>(answerValueDayJs);

  useEffect(() => {
    setValue(answerValueDayJs);
  }, [answerValue]);

  function handleChange(newValue: Dayjs | null | undefined) {
    if (newValue) {
      setValue(newValue);
      onQrItemChange({ ...qrTime, answer: [{ valueTime: newValue.format() }] });
    }
  }

  const renderQItemTime = isRepeated ? (
    <QItemTimePicker value={value} onTimeChange={handleChange} isTabled={isTabled} />
  ) : (
    <FullWidthFormComponentBox>
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          <QItemTimePicker value={value} onTimeChange={handleChange} isTabled={isTabled} />
          <QItemDisplayInstructions qItem={qItem} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );
  return <>{renderQItemTime}</>;
}

interface QItemTimePickerProps extends PropsWithIsTabledAttribute {
  value: Dayjs | null;
  onTimeChange: (newValue: Dayjs | null) => unknown;
}

function QItemTimePicker(props: QItemTimePickerProps) {
  const { value, onTimeChange, isTabled } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        showToolbar
        value={value}
        onChange={onTimeChange}
        renderInput={(params) => <StandardTextField fullWidth isTabled={isTabled} {...params} />}
      />
    </LocalizationProvider>
  );
}

export default QItemTime;
