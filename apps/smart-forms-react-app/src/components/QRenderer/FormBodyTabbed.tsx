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

import React, { useCallback, useState } from 'react';
import { Grid } from '@mui/material';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { PropsWithQrItemChangeHandler } from '../../interfaces/Interfaces';
import { TabContext, TabPanel } from '@mui/lab';
import { getQrItemsIndex, mapQItemsIndex } from '../../functions/IndexFunctions';
import QItemGroup from './QFormComponents/QItemGroup';
import { isTab } from '../../functions/TabFunctions';
import { updateLinkedItem } from '../../functions/QrItemFunctions';
import FormBodyTabList from './Tabs/FormBodyTabList';

interface Props extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem> {
  qForm: QuestionnaireItem;
  qrForm: QuestionnaireResponseItem;
  tabIndex: number;
  setTabIndex: (newTabIndex: number) => unknown;
}

function FormBodyTabbed(props: Props) {
  const { qForm, qrForm, tabIndex, setTabIndex, onQrItemChange } = props;

  const indexMap: Record<string, number> = mapQItemsIndex(qForm);
  const qFormItems = qForm.item;
  const qrFormItems = qrForm.item;

  const numOfTabs = qFormItems?.length ?? 0;
  const [tabsMarkedAsComplete, setTabsMarkedAsComplete] = useState<boolean[]>(
    new Array(numOfTabs).fill(false)
  );

  function handleQrGroupChange(qrItem: QuestionnaireResponseItem) {
    updateLinkedItem(qrItem, null, qrForm, indexMap);
    onQrItemChange(qrForm);
  }

  const updateTabIndex = useCallback((newTabIndex: number) => {
    setTabIndex(newTabIndex);
  }, []);

  if (qFormItems && qrFormItems) {
    const qrFormItemsByIndex = getQrItemsIndex(qFormItems, qrFormItems, indexMap);

    return (
      <Grid container spacing={2}>
        <TabContext value={tabIndex.toString()}>
          <Grid item xs={12} md={3.5} lg={3} xl={2.75}>
            <FormBodyTabList
              qFormItems={qFormItems}
              tabIndex={tabIndex}
              tabsMarkedAsComplete={tabsMarkedAsComplete}
              updateTabIndex={updateTabIndex}
            />
          </Grid>

          <Grid item xs={12} md={8.5} lg={9} xl={9.25}>
            {qFormItems.map((qItem, i) => {
              const qrItem = qrFormItemsByIndex[i];

              if (isTab(qItem) && !Array.isArray(qrItem)) {
                return (
                  <TabPanel
                    key={qItem.linkId}
                    sx={{ p: 0 }}
                    value={(i + 1).toString()}
                    data-test="renderer-tab-panel">
                    <QItemGroup
                      qItem={qItem}
                      qrItem={qrItem}
                      isRepeated={qItem.repeats ?? false}
                      groupCardElevation={1}
                      isMarkedAsComplete={tabsMarkedAsComplete[i]}
                      setMarkedAsComplete={() => {
                        const newTabsMarkedAsComplete = [...tabsMarkedAsComplete];
                        newTabsMarkedAsComplete[i] = !newTabsMarkedAsComplete[i];
                        setTabsMarkedAsComplete(newTabsMarkedAsComplete);
                      }}
                      onQrItemChange={handleQrGroupChange}></QItemGroup>
                  </TabPanel>
                );
              } else {
                return null;
              }
            })}
          </Grid>
        </TabContext>
      </Grid>
    );
  } else {
    return <>Unable to load form</>;
  }
}

export default FormBodyTabbed;
