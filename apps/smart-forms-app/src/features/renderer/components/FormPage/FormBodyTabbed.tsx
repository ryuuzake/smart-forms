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

import { useMemo } from 'react';
import { Grid } from '@mui/material';
import type { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r4';
import { TabContext, TabPanel } from '@mui/lab';
import { getQrItemsIndex, mapQItemsIndex } from '../../utils';
import GroupItem from './QFormComponents/GroupItem/GroupItem.tsx';
import { updateQrGroup } from '../../utils/qrItem.ts';
import FormBodyTabList from './Tabs/FormBodyTabList.tsx';
import type { PropsWithQrItemChangeHandler } from '../../types/renderProps.interface.ts';
import useQuestionnaireStore from '../../../../stores/useQuestionnaireStore.ts';

interface FormBodyTabbedProps extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem> {
  topLevelQItem: QuestionnaireItem;
  topLevelQRItem: QuestionnaireResponseItem;
}

function FormBodyTabbed(props: FormBodyTabbedProps) {
  const { topLevelQItem, topLevelQRItem, onQrItemChange } = props;

  const tabs = useQuestionnaireStore((state) => state.tabs);
  const currentTab = useQuestionnaireStore((state) => state.currentTabIndex);

  const indexMap: Record<string, number> = useMemo(
    () => mapQItemsIndex(topLevelQItem),
    [topLevelQItem]
  );

  const qItems = topLevelQItem.item;
  const qrItems = topLevelQRItem.item;

  function handleQrGroupChange(qrItem: QuestionnaireResponseItem) {
    updateQrGroup(qrItem, null, topLevelQRItem, indexMap);
    onQrItemChange(topLevelQRItem);
  }

  if (!qItems || !qrItems) {
    return <>Unable to load form</>;
  }

  const qrItemsByIndex = getQrItemsIndex(qItems, qrItems, indexMap);

  return (
    <Grid container spacing={2}>
      <TabContext value={currentTab.toString()}>
        <Grid item xs={12} md={3.5} lg={3} xl={2.75}>
          <FormBodyTabList qFormItems={qItems} currentTabIndex={currentTab} tabs={tabs} />
        </Grid>

        <Grid item xs={12} md={8.5} lg={9} xl={9.25}>
          {qItems.map((qItem, i) => {
            const qrItem = qrItemsByIndex[i];

            const isNotRepeatGroup = !Array.isArray(qrItem);
            const isTab = !!tabs[qItem.linkId];

            if (!isTab || !isNotRepeatGroup) {
              // Something has gone horribly wrong
              return null;
            }

            const isRepeated = qItem.repeats ?? false;
            const tabIsMarkedAsComplete = tabs[qItem.linkId].isComplete ?? false;

            return (
              <TabPanel
                key={qItem.linkId}
                sx={{ p: 0 }}
                value={i.toString()}
                data-test="renderer-tab-panel">
                <GroupItem
                  qItem={qItem}
                  qrItem={qrItem}
                  isRepeated={isRepeated}
                  groupCardElevation={1}
                  tabIsMarkedAsComplete={tabIsMarkedAsComplete}
                  tabs={tabs}
                  currentTabIndex={currentTab}
                  onQrItemChange={handleQrGroupChange}
                />
              </TabPanel>
            );
          })}
        </Grid>
      </TabContext>
    </Grid>
  );
}

export default FormBodyTabbed;
