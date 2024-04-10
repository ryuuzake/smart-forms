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

import type { Expression, QuestionnaireResponse } from 'fhir/r4';
import { createFhirPathContext } from './fhirpath';
import fhirpath from 'fhirpath';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';
import type {
  EnableWhenExpressions,
  EnableWhenRepeatExpression,
  EnableWhenSingleExpression
} from '../interfaces';

interface EvaluateInitialEnableWhenExpressionsParams {
  initialResponse: QuestionnaireResponse;
  enableWhenExpressions: EnableWhenExpressions;
  variablesFhirPath: Record<string, Expression[]>;
  existingFhirPathContext: Record<string, any>;
}

export function evaluateInitialEnableWhenExpressions(
  params: EvaluateInitialEnableWhenExpressionsParams
): {
  initialEnableWhenExpressions: EnableWhenExpressions;
  updatedFhirPathContext: Record<string, any>;
} {
  const { initialResponse, enableWhenExpressions, variablesFhirPath, existingFhirPathContext } =
    params;

  const initialEnableWhenExpressions: EnableWhenExpressions = {
    ...enableWhenExpressions
  };
  const updatedFhirPathContext = createFhirPathContext(
    initialResponse,
    variablesFhirPath,
    existingFhirPathContext
  );

  const initialEnableWhenSingleExpressions = evaluateEnableWhenSingleExpressions(
    initialEnableWhenExpressions.singleExpressions,
    updatedFhirPathContext
  );

  const initialEnableWhenRepeatExpressions = evaluateEnableWhenRepeatExpressions(
    initialEnableWhenExpressions.repeatExpressions,
    updatedFhirPathContext
  );

  return {
    initialEnableWhenExpressions: {
      singleExpressions: initialEnableWhenSingleExpressions.updatedExpressions,
      repeatExpressions: initialEnableWhenRepeatExpressions.updatedExpressions
    },
    updatedFhirPathContext
  };
}

function evaluateEnableWhenSingleExpressions(
  enableWhenSingleExpressions: Record<string, EnableWhenSingleExpression>,
  updatedFhirPathContext: Record<string, any>
): {
  updatedExpressions: Record<string, EnableWhenSingleExpression>;
  isUpdated: boolean;
} {
  let isUpdated = false;
  for (const linkId in enableWhenSingleExpressions) {
    try {
      const result = fhirpath.evaluate(
        '',
        enableWhenSingleExpressions[linkId].expression,
        updatedFhirPathContext,
        fhirpath_r4_model
      );

      // Update enableWhenExpressions if length of result array > 0
      if (result.length > 0) {
        isUpdated = true;
        enableWhenSingleExpressions[linkId].isEnabled = result[0];
      }

      // handle intersect edge case - evaluate() returns empty array if result is false
      if (
        enableWhenSingleExpressions[linkId].expression.includes('intersect') &&
        result.length === 0
      ) {
        isUpdated = true;
        enableWhenSingleExpressions[linkId].isEnabled = false;
      }
    } catch (e) {
      console.warn(
        e.message,
        `LinkId: ${linkId}\nExpression: ${enableWhenSingleExpressions[linkId].expression}`
      );
    }
  }

  return { updatedExpressions: enableWhenSingleExpressions, isUpdated };
}

function getNumOfEnableWhenExpressionItemInstances(
  enableWhenExpression: EnableWhenRepeatExpression,
  fhirPathContext: Record<string, any>
) {
  const result = fhirpath.evaluate(
    '',
    `%resource.descendants().where(linkId = '${enableWhenExpression.parentLinkId}').count()`,
    fhirPathContext,
    fhirpath_r4_model
  );

  return typeof result[0] === 'number' ? result[0] : null;
}

function evaluateEnableWhenRepeatExpressions(
  enableWhenRepeatExpressions: Record<string, EnableWhenRepeatExpression>,
  fhirPathContext: Record<string, any>
): {
  updatedExpressions: Record<string, EnableWhenRepeatExpression>;
  isUpdated: boolean;
} {
  let aggregatedUpdated = false;
  for (const linkId in enableWhenRepeatExpressions) {
    // Get number of repeat group instances in the QR
    const enableWhenExpression = enableWhenRepeatExpressions[linkId];

    const numOfInstances = getNumOfEnableWhenExpressionItemInstances(
      enableWhenExpression,
      fhirPathContext
    );
    if (!numOfInstances) {
      continue;
    }

    const lastLinkIdIndex = enableWhenExpression.expression.lastIndexOf('.where(linkId');
    if (lastLinkIdIndex === -1) {
      continue;
    }

    for (let i = 0; i < numOfInstances; i++) {
      const { isEnabled, isUpdated } = evaluateEnableWhenRepeatExpressionInstance(
        linkId,
        fhirPathContext,
        enableWhenExpression.expression,
        enableWhenExpression.parentLinkId,
        lastLinkIdIndex,
        i
      );

      if (typeof isEnabled === 'boolean') {
        enableWhenRepeatExpressions[linkId].enabledIndexes[i] = isEnabled;
      }

      aggregatedUpdated = aggregatedUpdated || isUpdated;
    }
  }

  return { updatedExpressions: enableWhenRepeatExpressions, isUpdated: aggregatedUpdated };
}

export function evaluateEnableWhenRepeatExpressionInstance(
  linkId: string,
  fhirPathContext: Record<string, any>,
  expression: string,
  parentLinkId: string,
  lastLinkIdIndex: number,
  instanceIndex: number
): { isEnabled: boolean | null; isUpdated: boolean } {
  const modifiedExpression =
    expression.slice(0, lastLinkIdIndex) +
    `.where(linkId='${parentLinkId}').item[${instanceIndex}]` +
    expression.slice(lastLinkIdIndex);

  let isEnabled = null;
  let isUpdated = false;
  try {
    const result = fhirpath.evaluate('', modifiedExpression, fhirPathContext, fhirpath_r4_model);

    // Update enableWhenExpressions if length of result array > 0
    if (result.length > 0 && typeof result[0] === 'boolean') {
      isEnabled = result[0];
      isUpdated = true;
    }

    // handle intersect edge case - evaluate() returns empty array if result is false
    if (expression.includes('intersect') && result.length === 0) {
      isEnabled = false;
      isUpdated = true;
    }
  } catch (e) {
    console.warn(e.message, `LinkId: ${linkId}\nExpression: ${expression}`);
  }

  return { isEnabled, isUpdated };
}

export function evaluateEnableWhenExpressions(
  fhirPathContext: Record<string, any>,
  enableWhenExpressions: EnableWhenExpressions
): {
  enableWhenExpsIsUpdated: boolean;
  updatedEnableWhenExpressions: EnableWhenExpressions;
} {
  const updatedEnableWhenExpressions: EnableWhenExpressions = {
    ...enableWhenExpressions
  };

  const updatedEnableWhenSingleExpressions = evaluateEnableWhenSingleExpressions(
    updatedEnableWhenExpressions.singleExpressions,
    fhirPathContext
  );

  const updatedEnableWhenRepeatExpressions = evaluateEnableWhenRepeatExpressions(
    updatedEnableWhenExpressions.repeatExpressions,
    fhirPathContext
  );

  const isUpdated =
    updatedEnableWhenSingleExpressions.isUpdated || updatedEnableWhenRepeatExpressions.isUpdated;

  return {
    enableWhenExpsIsUpdated: isUpdated,
    updatedEnableWhenExpressions: {
      singleExpressions: updatedEnableWhenSingleExpressions.updatedExpressions,
      repeatExpressions: updatedEnableWhenRepeatExpressions.updatedExpressions
    }
  };
}

interface MutateRepeatEnableWhenExpressionInstancesParams {
  questionnaireResponse: QuestionnaireResponse;
  variablesFhirPath: Record<string, Expression[]>;
  existingFhirPathContext: Record<string, any>;
  enableWhenExpressions: EnableWhenExpressions;
  parentRepeatGroupLinkId: string;
  parentRepeatGroupIndex: number;
  actionType: 'add' | 'remove';
}

export function mutateRepeatEnableWhenExpressionInstances(
  params: MutateRepeatEnableWhenExpressionInstancesParams
): { updatedEnableWhenExpressions: EnableWhenExpressions; isUpdated: boolean } {
  const {
    questionnaireResponse,
    variablesFhirPath,
    existingFhirPathContext,
    enableWhenExpressions,
    parentRepeatGroupLinkId,
    parentRepeatGroupIndex,
    actionType
  } = params;

  const { repeatExpressions } = enableWhenExpressions;

  const updatedFhirPathContext = createFhirPathContext(
    questionnaireResponse,
    variablesFhirPath,
    existingFhirPathContext
  );

  let isUpdated = false;
  for (const linkId in repeatExpressions) {
    if (repeatExpressions[linkId].parentLinkId !== parentRepeatGroupLinkId) {
      continue;
    }

    if (actionType === 'add') {
      const { isEnabled } = evaluateEnableWhenRepeatExpressionInstance(
        linkId,
        updatedFhirPathContext,
        repeatExpressions[linkId].expression,
        repeatExpressions[linkId].parentLinkId,
        repeatExpressions[linkId].expression.lastIndexOf('.where(linkId'),
        parentRepeatGroupIndex
      );

      if (typeof isEnabled === 'boolean') {
        repeatExpressions[linkId].enabledIndexes[parentRepeatGroupIndex] = isEnabled;
      }
    } else if (actionType === 'remove') {
      repeatExpressions[linkId].enabledIndexes.splice(parentRepeatGroupIndex, 1);
    }

    isUpdated = true;
  }

  return { updatedEnableWhenExpressions: enableWhenExpressions, isUpdated };
}
