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

import type { QuestionnaireItem } from 'fhir/r5';

export function resolveDuplicateLinkIds(
  qItem: QuestionnaireItem,
  linkIds: Set<string>,
  duplicateLinkIds: Record<string, string>
): QuestionnaireItem | null {
  const items = qItem.item;
  if (items && items.length > 0) {
    // iterate through items of item recursively
    const resolvedItems: QuestionnaireItem[] = [];
    items.forEach((item) => {
      const resolvedItem = resolveDuplicateLinkIds(item, linkIds, duplicateLinkIds);
      if (resolvedItem) {
        resolvedItems.push(resolvedItem);
        linkIds.add(resolvedItem.linkId);
      } else {
        // Item is not changed, therefore the original item is used
        resolvedItems.push(item);
        linkIds.add(item.linkId);
      }
    });
    qItem.item = resolvedItems;

    if (linkIds.has(qItem.linkId)) {
      const prependedLinkId = assignLinkIdPrefix(qItem.linkId, linkIds);
      duplicateLinkIds[qItem.linkId] = prependedLinkId;
      qItem.linkId = prependedLinkId;
    }
    return qItem;
  }

  // Add linkIdPrefix to linkId if it's a duplicate
  if (linkIds.has(qItem.linkId)) {
    const prependedLinkId = assignLinkIdPrefix(qItem.linkId, linkIds);
    duplicateLinkIds[qItem.linkId] = prependedLinkId;
    qItem.linkId = prependedLinkId;

    return qItem;
  }

  return null;
}

function assignLinkIdPrefix(itemLinkId: string, linkIds: Set<string>) {
  const linkIdPrefix = 'linkIdPrefix';
  let prefixedId = linkIdPrefix + '-' + itemLinkId;

  // Increment prefixCount on linkIdPrefix until it is not a duplicate
  let prefixCount = 0;
  while (linkIds.has(prefixedId)) {
    prefixCount++;
    prefixedId = linkIdPrefix + '-' + prefixCount.toString() + '-' + itemLinkId;
  }
  return prefixedId;
}
