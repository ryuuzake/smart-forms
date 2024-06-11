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

import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { StyledRoot } from '../../components/Layout/Layout.styles.ts';
import { SdcIdeMain } from './SdcIdeMain.ts';

function SdcIdeLayout() {
  return (
    <StyledRoot>
      <Helmet>
        <title>SDC IDE</title>
      </Helmet>

      <SdcIdeMain>
        <Outlet />
      </SdcIdeMain>
    </StyledRoot>
  );
}

export default SdcIdeLayout;
