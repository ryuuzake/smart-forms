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

import type { Coding, Questionnaire, QuestionnaireItem } from 'fhir/r4';
import type {
  AnswerExpression,
  CalculatedExpression,
  EnableWhenItemProperties,
  ValueSetPromise,
  Variables
} from '../interfaces/Interfaces';
import { getEnableWhenItemProperties } from '../functions/EnableWhenFunctions';
import {
  getAnswerExpression,
  getCalculatedExpression,
  getFhirPathVariables,
  getXFhirQueryVariables
} from '../functions/ItemControlFunctions';
import {
  createValueSetToXFhirQueryVariableNameMap,
  getTerminologyServerUrl,
  getValueSetCodings,
  getValueSetPromise,
  getValueSetUrlFromContained,
  resolvePromises
} from '../functions/ValueSetFunctions';
import { isLaunchContext } from '../functions/populateFunctions/typePredicates.ts';
import type { LaunchContext } from '../interfaces/populate.interface.ts';

export class QuestionnaireProvider {
  questionnaire: Questionnaire;
  variables: Variables;
  launchContexts: Record<string, LaunchContext>;
  calculatedExpressions: Record<string, CalculatedExpression>;
  answerExpressions: Record<string, AnswerExpression>;
  enableWhenItems: Record<string, EnableWhenItemProperties>;
  preprocessedValueSetCodings: Record<string, Coding[]>;

  constructor() {
    this.questionnaire = {
      resourceType: 'Questionnaire',
      status: 'active'
    };
    this.variables = { fhirPathVariables: {}, xFhirQueryVariables: {} };
    this.launchContexts = {};
    this.calculatedExpressions = {};
    this.answerExpressions = {};
    this.enableWhenItems = {};
    this.preprocessedValueSetCodings = {};
  }

  async setQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    this.variables = { fhirPathVariables: {}, xFhirQueryVariables: {} };
    this.launchContexts = {};
    this.calculatedExpressions = {};
    this.answerExpressions = {};
    this.enableWhenItems = {};
    this.preprocessedValueSetCodings = {};

    this.questionnaire = questionnaire;
    await this.preprocessQuestionnaire();
  }

  /**
   * Read all enableWhen items and calculated expressions in questionnaireResponse
   *
   * @author Sean Fong
   */
  async preprocessQuestionnaire() {
    if (!this.questionnaire.item) return;

    // Store launch contexts
    if (this.questionnaire.extension && this.questionnaire.extension.length > 0) {
      for (const ext of this.questionnaire.extension) {
        if (isLaunchContext(ext)) {
          const launchContextName = ext.extension[0].valueId ?? ext.extension[0].valueCoding?.code;
          if (launchContextName) {
            this.launchContexts[launchContextName] = ext;
          }
        }
      }
    }

    // Process contained ValueSets
    const valueSetPromiseMap: Record<string, ValueSetPromise> = {};
    if (this.questionnaire.contained && this.questionnaire.contained.length > 0) {
      this.questionnaire.contained.forEach((entry) => {
        if (entry.resourceType === 'ValueSet' && entry.id) {
          if (entry.expansion) {
            // Store contained valueSet codings
            this.preprocessedValueSetCodings[entry.id] = getValueSetCodings(entry);
          } else {
            // Add unexpanded contained ValueSets to valueSetPromiseMap
            const valueSetUrl = getValueSetUrlFromContained(entry);
            if (valueSetUrl) {
              valueSetPromiseMap[entry.id] = {
                promise: getValueSetPromise(valueSetUrl)
              };
            }
          }
        }
      });
    }

    // Store questionnaire-level variables
    if (this.questionnaire.extension && this.questionnaire.extension.length > 0) {
      this.variables.fhirPathVariables['QuestionnaireLevel'] = getFhirPathVariables(
        this.questionnaire.extension
      );

      for (const expression of getXFhirQueryVariables(this.questionnaire.extension)) {
        if (expression.name) {
          this.variables.xFhirQueryVariables[expression.name] = {
            valueExpression: expression
          };
        }
      }
    }

    // Recursively read enableWhen items, calculated expressions and valueSets to be expanded
    this.questionnaire.item.forEach((item) => {
      this.readQuestionnaireItem(item, valueSetPromiseMap);
    });

    // Create a <valueSetUrl, XFhirQueryVariableName> map
    const valueSetToXFhirQueryVariableNameMap: Record<string, string> =
      createValueSetToXFhirQueryVariableNameMap(this.variables.xFhirQueryVariables);

    if (Object.keys(valueSetToXFhirQueryVariableNameMap).length > 0) {
      for (const valueSetUrl in valueSetToXFhirQueryVariableNameMap) {
        valueSetPromiseMap[valueSetUrl] = {
          promise: getValueSetPromise(valueSetUrl)
        };
      }
    }

    // Resolve promises and store valueSet codings in preprocessedValueSetCodings AND XFhirQueryVariables
    const valueSetPromises = await resolvePromises(valueSetPromiseMap);

    for (const valueSetUrl in valueSetPromises) {
      const valueSet = valueSetPromises[valueSetUrl].valueSet;

      if (valueSet) {
        if (valueSetToXFhirQueryVariableNameMap[valueSetUrl]) {
          // valueSetUrl is in x-fhir-query variables, save to variable
          const variableName = valueSetToXFhirQueryVariableNameMap[valueSetUrl];
          const variable = this.variables.xFhirQueryVariables[variableName];
          this.variables.xFhirQueryVariables[variableName] = {
            ...variable,
            result: valueSetPromises[valueSetUrl].valueSet
          };
        } else {
          // valueSetUrl is in x-fhir-query variables, save to preprocessedValueSetCodings
          this.preprocessedValueSetCodings[valueSetUrl] = getValueSetCodings(valueSet);
        }
      }
    }
  }

  /**
   * Read enableWhen items and calculated expressions of each qItem recursively
   *
   * @author Sean Fong
   */
  readQuestionnaireItem(
    item: QuestionnaireItem,
    valueSetPromiseMap: Record<string, ValueSetPromise>
  ) {
    const items = item.item;
    if (items && items.length > 0) {
      // iterate through items of item recursively
      items.forEach((item) => {
        this.readQuestionnaireItem(item, valueSetPromiseMap);
      });
    }

    // Read calculated/answer expressions, enable when items, valueSets and variables from qItem
    const calculatedExpression = getCalculatedExpression(item);
    if (calculatedExpression) {
      this.calculatedExpressions[item.linkId] = {
        expression: `${calculatedExpression.expression}`
      };
    }

    const answerExpression = getAnswerExpression(item);
    if (answerExpression) {
      this.answerExpressions[item.linkId] = {
        expression: `${answerExpression.expression}`
      };
    }

    const enableWhenItemProperties = getEnableWhenItemProperties(item);
    if (enableWhenItemProperties) {
      this.enableWhenItems[item.linkId] = enableWhenItemProperties;
    }

    const valueSetUrl = item.answerValueSet;
    if (valueSetUrl) {
      if (!valueSetPromiseMap[valueSetUrl] && !valueSetUrl.startsWith('#')) {
        const terminologyServerUrl = getTerminologyServerUrl(item);
        valueSetPromiseMap[valueSetUrl] = {
          promise: getValueSetPromise(valueSetUrl, terminologyServerUrl)
        };
      }
    }

    if (item.extension) {
      this.variables.fhirPathVariables[item.linkId] = getFhirPathVariables(item.extension);

      for (const expression of getXFhirQueryVariables(item.extension)) {
        if (expression.name) {
          this.variables.xFhirQueryVariables[expression.name] = {
            valueExpression: expression
          };
        }
      }
    }
  }
}
