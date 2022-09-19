import React from 'react';
import { Container, FormControl, Grid, TextField, Typography } from '@mui/material';
import { PropsWithQrItemChangeHandler, PropsWithRepeatsAttribute } from '../FormModel';
import { QuestionnaireResponseService } from '../../questionnaireResponse/QuestionnaireResponseService';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithRepeatsAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemString(props: Props) {
  const { qItem, qrItem, repeats, onQrItemChange } = props;

  let qrString = qrItem ? qrItem : QuestionnaireResponseService.createQrItem(qItem);
  const valueString = qrString['answer'] ? qrString['answer'][0].valueString : '';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    qrString = { ...qrString, answer: [{ valueString: e.target.value }] };
    onQrItemChange(qrString);
  }

  const renderQItemString = repeats ? (
    <Container>
      <TextField id={qItem.linkId} value={valueString} onChange={handleChange} />
    </Container>
  ) : (
    <FormControl>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Typography>{qItem.text}</Typography>
        </Grid>
        <Grid item xs={7}>
          <Container>
            <TextField id={qItem.linkId} value={valueString} onChange={handleChange} />
          </Container>
        </Grid>
      </Grid>
    </FormControl>
  );

  return <div>{renderQItemString}</div>;
}

export default QItemString;
