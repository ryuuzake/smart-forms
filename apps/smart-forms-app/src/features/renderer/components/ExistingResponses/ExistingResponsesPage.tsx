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

import { Card, Container, Fade } from '@mui/material';
import { Helmet } from 'react-helmet';
import PageHeading from '../../../dashboard/components/DashboardPages/PageHeading.tsx';
import ExistingResponsesTable from './ExistingResponsesTable.tsx';

function ExistingResponsesPage() {
  return (
    <>
      <Helmet>
        <title>Existing Responses</title>
      </Helmet>
      <Fade in={true}>
        <Container data-test="dashboard-existing-container">
          <PageHeading>Existing Responses</PageHeading>

          <Card>
            <ExistingResponsesTable />
          </Card>
        </Container>
      </Fade>
    </>
  );
}

export default ExistingResponsesPage;
