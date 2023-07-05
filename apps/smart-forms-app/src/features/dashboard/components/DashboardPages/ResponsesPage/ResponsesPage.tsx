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

import { useContext, useMemo, useRef, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Fade,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import {
  applySortFilter,
  constructBundle,
  getClientBundlePromise,
  getComparator,
  getResponseListItems
} from '../../../utils/dashboard.ts';
import { useQuery } from '@tanstack/react-query';
import type { Bundle, QuestionnaireResponse } from 'fhir/r4';
import { SelectedQuestionnaireContext } from '../../../contexts/SelectedQuestionnaireContext.tsx';
import ResponseListToolbar from './TableComponents/ResponseListToolbar.tsx';
import ResponseListHead from './TableComponents/ResponseListHead.tsx';
import ResponseListFeedback from './TableComponents/ResponseListFeedback.tsx';
import Scrollbar from '../../../../../components/Scrollbar/Scrollbar.tsx';
import BackToQuestionnairesButton from './Buttons/BackToQuestionnairesButton.tsx';
import OpenResponseButton from './Buttons/OpenResponseButton.tsx';
import useDebounce from '../../../../renderer/hooks/useDebounce.ts';
import { Helmet } from 'react-helmet';
import type { TableAttributes } from '../../../../renderer/types/table.interface.ts';
import type { ResponseListItem, SelectedResponse } from '../../../types/list.interface.ts';
import useConfigStore from '../../../../../stores/useConfigStore.ts';
import DashboardHeading from '../DashboardHeading.tsx';
import ResponseTableRow from './TableComponents/ResponseTableRow.tsx';
import TablePagination from '../TablePagination.tsx';

const tableHeaders: TableAttributes[] = [
  { id: 'title', label: 'Questionnaire Title', alignRight: false },
  { id: 'author', label: 'Author', alignRight: false },
  { id: 'authored', label: 'Authored On', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false }
];

function ResponsesPage() {
  const smartClient = useConfigStore((state) => state.smartClient);
  const patient = useConfigStore((state) => state.patient);
  const questionnaireSource = useConfigStore((state) => state.questionnaireSource);

  const { existingResponses } = useContext(SelectedQuestionnaireContext);

  // Scroll to buttons row when response is selected - for screens with small height
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  function executeScroll() {
    if (buttonsRef.current) {
      buttonsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedResponse, setSelectedResponse] = useState<SelectedResponse | null>(null);
  const [orderBy, setOrderBy] = useState<keyof ResponseListItem>('authored');
  const [searchInput, setSearchInput] = useState('');

  // search responses
  const debouncedInput = useDebounce(searchInput, 300);
  const numOfSearchEntries = 50;

  let queryUrl = `/QuestionnaireResponse?_count=${numOfSearchEntries}&_sort=-authored&patient=${patient?.id}&`;
  if (debouncedInput) {
    queryUrl += 'questionnaire.title:contains=' + debouncedInput;
  }

  const { data, status, error, isFetching } = useQuery<Bundle>(
    ['response', queryUrl],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => getClientBundlePromise(smartClient!, queryUrl),
    {
      enabled: questionnaireSource === 'remote' && !!smartClient && debouncedInput === searchInput
    }
  );

  // create existing responses from a selectedResponse questionnaire if exists
  const existingResponseBundle: Bundle = useMemo(
    () => constructBundle(existingResponses),
    [existingResponses]
  );

  // construct response list items for data display
  const responseListItems: ResponseListItem[] = useMemo(
    () => getResponseListItems(existingResponses.length === 0 ? data : existingResponseBundle),
    [data, existingResponseBundle, existingResponses.length]
  );

  const emptyRows: number = useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - responseListItems.length) : 0),
    [page, responseListItems.length, rowsPerPage]
  );

  // sort or perform client-side filtering or items
  const filteredListItems: ResponseListItem[] = useMemo(
    () =>
      applySortFilter(
        responseListItems,
        getComparator(order, orderBy, 'response'),
        questionnaireSource
      ) as ResponseListItem[],
    [order, orderBy, responseListItems, questionnaireSource]
  );

  const isEmpty = filteredListItems.length === 0 && status !== 'loading';

  // Event handlers
  const handleRequestSort = (_: MouseEvent, property: keyof ResponseListItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (id: string) => {
    const selectedItem = filteredListItems.find((item) => item.id === id);

    if (selectedItem) {
      executeScroll();
      if (selectedItem.id === selectedResponse?.listItem.id) {
        setSelectedResponse(null);
      } else {
        const resource = data?.entry?.find((entry) => entry.resource?.id === id)?.resource;

        if (resource) {
          setSelectedResponse({
            listItem: selectedItem,
            resource: resource as QuestionnaireResponse
          });
        } else {
          setSelectedResponse(null);
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Responses</title>
      </Helmet>
      <Fade in={true}>
        <Container data-test="dashboard-responses-container">
          <DashboardHeading headingText="Responses" setPage={setPage} />

          <Card>
            <ResponseListToolbar
              selected={selectedResponse?.listItem}
              searchInput={searchInput}
              clearSelection={() => setSelectedResponse(null)}
              onSearch={(input) => {
                setPage(0);
                setSearchInput(input);
              }}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 600 }}>
                <Table>
                  <ResponseListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHeaders}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredListItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id } = row;
                        const isSelected = selectedResponse?.listItem.id === id;

                        return (
                          <ResponseTableRow
                            key={id}
                            row={row}
                            isSelected={isSelected}
                            onRowClick={() => handleRowClick(id)}
                          />
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {(isEmpty || status === 'error' || status === 'loading') &&
                  filteredListItems.length === 0 ? (
                    <ResponseListFeedback
                      isEmpty={isEmpty}
                      status={status}
                      searchInput={searchInput}
                      error={error}
                    />
                  ) : null}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              isFetching={isFetching}
              numOfItems={filteredListItems.length}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          </Card>

          <Stack direction="row" alignItems="center" my={5} ref={buttonsRef}>
            <BackToQuestionnairesButton />
            <Box flexGrow={1} />
            <OpenResponseButton selectedResponse={selectedResponse} />
          </Stack>
        </Container>
      </Fade>
    </>
  );
}

export default ResponsesPage;
