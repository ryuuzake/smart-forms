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

import { useQuery } from '@tanstack/react-query';
import { Questionnaire } from 'fhir/r4';
import { fetchQuestionnaire, questionnaireIsValid } from './fetchQuestionnaire.ts';
import RendererPage from './RendererPage.tsx';

function HomePage() {
  // get query url from url params
  const urlParams = new URLSearchParams(window.location.search);
  const questionnaireUrl = urlParams.get('url') ?? '';

  // console.log(questionnaireUrl);

  const { data: questionnaire, isFetching } = useQuery<Questionnaire>(
    ['questionnaire', questionnaireUrl],
    () => fetchQuestionnaire(questionnaireUrl)
  );

  if (isFetching) {
    return <h2>Loading questionnaire...</h2>;
  }

  if (!questionnaire) {
    return (
      <>
        <h2>Questionnaire not found. </h2>
        <a href={window.location.origin}>
          <button>Go to {window.location.origin}</button>
        </a>
      </>
    );
  }

  if (!questionnaireIsValid(questionnaire)) {
    return (
      <>
        <h2>Questionnaire is not valid.</h2>
        <a href={window.location.origin}>
          <button>Go to {window.location.origin}</button>
        </a>
      </>
    );
  }

  return <RendererPage questionnaire={questionnaire} />;
}

export default HomePage;
