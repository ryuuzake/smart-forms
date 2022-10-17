import React from 'react';
import { FormControl, Grid, RadioGroup, Typography } from '@mui/material';
import { QItemChoiceOrientation } from '../../../../interfaces/Enums';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { findInAnswerValueSetCodings } from '../../../../functions/ChoiceFunctions';
import QItemChoiceRadioSingle from './QItemChoiceRadioSingle';
import { createQrItem } from '../../../../functions/QrItemFunctions';
import {
  PropsWithQrItemChangeHandler,
  PropsWithRepeatsAttribute
} from '../../../../interfaces/Interfaces';
import useValueSetOptions from '../../../../custom-hooks/useValueSetOptions';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithRepeatsAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
  orientation: QItemChoiceOrientation;
}

function QItemChoiceRadioAnswerValueSet(props: Props) {
  const { qItem, qrItem, repeats, onQrItemChange, orientation } = props;

  const qrChoiceRadio = qrItem ? qrItem : createQrItem(qItem);

  let valueRadio: string | undefined;
  if (qrChoiceRadio['answer']) {
    valueRadio = qrChoiceRadio['answer'][0].valueCoding?.code;
  }

  const [options] = useValueSetOptions(qItem);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (options.length > 0) {
      const qrAnswer = findInAnswerValueSetCodings(options, event.target.value);
      if (qrAnswer) {
        onQrItemChange({ ...qrChoiceRadio, answer: [{ valueCoding: qrAnswer }] });
      }
    }
  }

  const choiceRadio = (
    <RadioGroup
      row={orientation === QItemChoiceOrientation.Horizontal}
      name={qItem.text}
      id={qItem.id}
      onChange={handleChange}
      value={valueRadio ?? null}>
      {options.map((option) => {
        return (
          <QItemChoiceRadioSingle
            key={option.code ?? ''}
            value={option.code ?? ''}
            label={option.display ?? `${option.code}`}
          />
        );
      })}
    </RadioGroup>
  );

  const renderQItemChoiceRadio = repeats ? (
    <>{choiceRadio}</>
  ) : (
    <FormControl>
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <Typography>{qItem.text}</Typography>
        </Grid>
        <Grid item xs={7}>
          {choiceRadio}
        </Grid>
      </Grid>
    </FormControl>
  );
  return <>{renderQItemChoiceRadio}</>;
}

export default QItemChoiceRadioAnswerValueSet;
