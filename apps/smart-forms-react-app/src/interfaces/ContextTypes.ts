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

import {
  Patient,
  Practitioner,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer
} from 'fhir/r5';
import Client from 'fhirclient/lib/Client';
import { EnableWhenItemProperties, EnableWhenItems } from './Interfaces';
import { PageType } from './Enums';

export type EnableWhenContextType = {
  items: Record<string, EnableWhenItemProperties>;
  linkMap: Record<string, string[]>;
  setItems: (
    enableWhenItems: EnableWhenItems,
    questionnaireResponseForm: QuestionnaireResponseItem
  ) => unknown;
  updateItem: (linkId: string, newAnswer: QuestionnaireResponseItemAnswer[]) => unknown;
  checkItemIsEnabled: (linkId: string) => boolean;
};

export type LaunchContextType = {
  fhirClient: Client | null;
  patient: Patient | null;
  user: Practitioner | null;
  setFhirClient: (client: Client) => unknown;
  setPatient: (patient: Patient) => unknown;
  setUser: (user: Practitioner) => unknown;
};

export type QuestionnaireActiveContextType = {
  questionnaireActive: boolean;
  setQuestionnaireActive: (questionnaireActive: boolean) => unknown;
};

export type PreviewModeContextType = {
  isPreviewMode: boolean;
  setIsPreviewMode: (previewMode: boolean) => unknown;
};

export type PageSwitcherContextType = {
  currentPage: PageType;
  goToPage: (page: PageType) => unknown;
};

export type SideBarContextType = {
  isExpanded: boolean;
  setIsExpanded: (sideBarActive: boolean) => unknown;
};
