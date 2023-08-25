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

import RendererDebugFooter from '../../RendererDebugFooter/RendererDebugFooter.tsx';
import { Helmet } from 'react-helmet';
import FormRenderer from './FormRenderer.tsx';
import useQuestionnaireStore from '../../../../../stores/useQuestionnaireStore.ts';
import useQuestionnaireResponseStore from '../../../../../stores/useQuestionnaireResponseStore.ts';
import useConfigStore from '../../../../../stores/useConfigStore.ts';
import FormInvalid from '../FormInvalid.tsx';

function FormWrapper() {
  const sourceQuestionnaire = useQuestionnaireStore((state) => state.sourceQuestionnaire);
  const updatableResponse = useQuestionnaireResponseStore((state) => state.updatableResponse);

  const debugMode = useConfigStore((state) => state.debugMode);

  const topLevelQItems = sourceQuestionnaire.item;
  const topLevelQRItems = updatableResponse.item;

  if (!topLevelQItems || !topLevelQRItems) {
    return <FormInvalid questionnaire={sourceQuestionnaire} />;
  }

  if (topLevelQItems.length === 0 || topLevelQRItems.length === 0) {
    return <FormInvalid questionnaire={sourceQuestionnaire} />;
  }

  return (
    <>
      <Helmet>
        <title>{sourceQuestionnaire.title ?? 'Form Renderer'}</title>
      </Helmet>

      <FormRenderer />

      {/* Debug footer */}
      {debugMode ? <RendererDebugFooter /> : null}
    </>
  );
}

export default FormWrapper;
