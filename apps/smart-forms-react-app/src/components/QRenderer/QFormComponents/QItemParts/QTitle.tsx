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
import type { Extension, Questionnaire } from 'fhir/r5';
import parse from 'html-react-parser';

interface Props {
  questionnaire: Questionnaire;
}

function QTitle(props: Props) {
  const { questionnaire } = props;

  const xHtmlString = getXHtmlStringFromQuestionnaire(questionnaire);

  if (xHtmlString) {
    return <>{parse(xHtmlString)}</>;
  } else {
    return <>{questionnaire.title}</>;
  }
}

export default QTitle;

function getXHtmlStringFromQuestionnaire(questionnaire: Questionnaire): string | null {
  const itemControl = questionnaire._title?.extension?.find(
    (extension: Extension) =>
      extension.url === 'http://hl7.org/fhir/StructureDefinition/rendering-xhtml'
  );

  if (itemControl) {
    if (itemControl.valueString) {
      return itemControl.valueString;
    }
  }
  return null;
}
