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

import type { ChangeEvent, SyntheticEvent } from 'react';
import { memo, useState } from 'react';
import { Autocomplete, Box, CircularProgress, Fade, Grid, Tooltip } from '@mui/material';
import type { Coding, QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r4';

import type {
  PropsWithIsRepeatedAttribute,
  PropsWithIsTabledAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../../interfaces/Interfaces';
import { createEmptyQrItem } from '../../../../../functions/QrItemFunctions';
import QItemDisplayInstructions from '../QItemSimple/QItemDisplayInstructions';
import QItemLabel from '../QItemParts/QItemLabel';
import { StandardTextField } from '../../../../StyledComponents/Textfield.styles';
import { FullWidthFormComponentBox } from '../../../../StyledComponents/Boxes.styles';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '../../../../../custom-hooks/useDebounce';
import useTerminologyServerQuery from '../../../../../custom-hooks/useTerminologyServerQuery.ts';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import useRenderingExtensions from '../../../../../custom-hooks/useRenderingExtensions';
import { getTerminologyServerUrl } from '../../../../../functions/ValueSetFunctions.ts';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute,
    PropsWithIsTabledAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemOpenChoiceAutocomplete(props: Props) {
  const { qItem, qrItem, isRepeated, isTabled, onQrItemChange } = props;
  const qrOpenChoice = qrItem ?? createEmptyQrItem(qItem);

  // Init input value
  let valueAutocomplete: Coding | string | undefined;
  if (qrOpenChoice.answer) {
    const answer = qrOpenChoice.answer[0];
    valueAutocomplete = answer.valueCoding ? answer.valueCoding : answer.valueString;
  }

  if (!valueAutocomplete) {
    valueAutocomplete = '';
  }

  // Get additional rendering extensions
  const { displayUnit, displayPrompt, displayInstructions, readOnly, entryFormat } =
    useRenderingExtensions(qItem);

  // Query ontoserver for options
  const maxList = 10;

  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);

  const answerValueSetUrl = qItem.answerValueSet;
  const terminologyServerUrl = getTerminologyServerUrl(qItem);
  const { options, loading, feedback } = useTerminologyServerQuery(
    answerValueSetUrl,
    maxList,
    input,
    debouncedInput,
    terminologyServerUrl
  );

  if (!answerValueSetUrl) return null;

  // Event handlers
  function handleValueChange(_: SyntheticEvent<Element, Event>, newValue: Coding | string | null) {
    if (newValue === null) {
      setInput('');
      newValue = '';
    }

    if (typeof newValue === 'string') {
      if (newValue !== '') {
        onQrItemChange({
          ...createEmptyQrItem(qItem),
          answer: [{ valueString: newValue }]
        });
      } else {
        onQrItemChange(createEmptyQrItem(qItem));
      }
    } else {
      onQrItemChange({
        ...createEmptyQrItem(qItem),
        answer: [{ valueCoding: newValue }]
      });
    }
  }

  const openChoiceAutocomplete = (
    <>
      <Box display="flex">
        <Autocomplete
          id={qItem.id}
          value={valueAutocomplete}
          options={options}
          getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.display}`)}
          loading={loading}
          loadingText={'Fetching results...'}
          clearOnEscape
          freeSolo
          autoHighlight
          sx={{ maxWidth: !isTabled ? 280 : 3000, flexGrow: 1 }}
          placeholder={entryFormat}
          onChange={handleValueChange}
          filterOptions={(x) => x}
          renderInput={(params) => (
            <StandardTextField
              {...params}
              value={input}
              onBlur={() => {
                // set answer to current input when text field is unfocused
                if (!valueAutocomplete && input !== '') {
                  onQrItemChange({
                    ...createEmptyQrItem(qItem),
                    answer: [{ valueString: input }]
                  });
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              isTabled={isTabled}
              disabled={readOnly}
              label={displayPrompt}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {!valueAutocomplete || valueAutocomplete === '' ? (
                      <SearchIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : null}
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : feedback ? (
                      <Fade in={!!feedback} timeout={300}>
                        <Tooltip title={feedback.message} arrow sx={{ ml: 1 }}>
                          {
                            {
                              info: <InfoIcon fontSize="small" color="info" />,
                              warning: <WarningAmberIcon fontSize="small" color="warning" />,
                              success: <DoneIcon fontSize="small" color="success" />,
                              error: <ErrorIcon fontSize="small" color="error" />
                            }[feedback.color]
                          }
                        </Tooltip>
                      </Fade>
                    ) : null}
                    {params.InputProps.endAdornment}
                    {displayUnit}
                  </>
                )
              }}
              data-test="q-item-open-choice-autocomplete-field"
            />
          )}
        />
      </Box>
    </>
  );

  const renderQItemOpenChoiceAutocomplete = isRepeated ? (
    <>{openChoiceAutocomplete}</>
  ) : (
    <FullWidthFormComponentBox>
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          {openChoiceAutocomplete}
          <QItemDisplayInstructions displayInstructions={displayInstructions} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );
  return <>{renderQItemOpenChoiceAutocomplete}</>;
}

export default memo(QItemOpenChoiceAutocomplete);
