import { questionnaireResponseStore, questionnaireStore } from './stores';
import type { Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import { removeEmptyAnswers } from './utils/removeEmptyAnswers';
import type { ItemToRepopulate } from './utils/repopulateItems';
import { getItemsToRepopulate } from './utils/repopulateItems';
import { repopulateItemsIntoResponse } from './utils/repopulateIntoResponse';

export * from './components';
export * from './stores';
export * from './hooks';
export * from './utils';
export { RendererThemeProvider } from './theme';
export type { ItemToRepopulate };

/**
 * Destroy the form to clean up the questionnaire and questionnaireResponse stores.
 *
 * @author Sean Fong
 */
export function destroyForm(): void {
  questionnaireStore.getState().destroySourceQuestionnaire();
  questionnaireResponseStore.getState().destroySourceResponse();
}

/**
 * Get the filled QuestionnaireResponse at its current state.
 * If no changes have been made to the form, the initial QuestionnaireResponse is returned.
 *
 * @author Sean Fong
 */
export function getResponse(): QuestionnaireResponse {
  return questionnaireResponseStore.getState().updatableResponse;
}

/**
 * Remove all hidden answers from the filled QuestionnaireResponse.
 * This takes into account enableWhens, enableWhenExpressions, items without item.answer, empty item.answer arrays and empty strings.
 *
 * @author Sean Fong
 */
export function removeEmptyAnswersFromResponse(
  questionnaire: Questionnaire,
  questionnaireResponse: QuestionnaireResponse
): QuestionnaireResponse {
  const enableWhenIsActivated = questionnaireStore.getState().enableWhenIsActivated;
  const enableWhenItems = questionnaireStore.getState().enableWhenItems;
  const enableWhenExpressions = questionnaireStore.getState().enableWhenExpressions;

  return removeEmptyAnswers({
    questionnaire,
    questionnaireResponse,
    enableWhenIsActivated,
    enableWhenItems,
    enableWhenExpressions
  });
}

/**
 * Compare latest data from the server with the current QuestionnaireResponse and decide items to re-populate.
 *
 * @author Sean Fong
 */
export function generateItemsToRepopulate(populatedResponse: QuestionnaireResponse) {
  const sourceQuestionnaire = questionnaireStore.getState().sourceQuestionnaire;
  const tabs = questionnaireStore.getState().tabs;
  const updatableResponse = questionnaireResponseStore.getState().updatableResponse;
  const enableWhenIsActivated = questionnaireStore.getState().enableWhenIsActivated;
  const enableWhenItems = questionnaireStore.getState().enableWhenItems;
  const enableWhenExpressions = questionnaireStore.getState().enableWhenExpressions;

  return getItemsToRepopulate({
    sourceQuestionnaire,
    tabs,
    populatedResponse,
    updatableResponse,
    enableWhenIsActivated,
    enableWhenItems,
    enableWhenExpressions
  });
}

/**
 * Re-populate checked items in the re-population dialog into the current QuestionnaireResponse.
 *
 * @author Sean Fong
 */
export function repopulateResponse(checkedItemsToRepopulate: Record<string, ItemToRepopulate>) {
  const sourceQuestionnaire = questionnaireStore.getState().sourceQuestionnaire;
  const updatableResponse = questionnaireResponseStore.getState().updatableResponse;

  return repopulateItemsIntoResponse(
    sourceQuestionnaire,
    updatableResponse,
    checkedItemsToRepopulate
  );
}
