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

import { Box, List, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import RendererOperationItem from './RendererOperationItem.tsx';
import GradingIcon from '@mui/icons-material/Grading';
import { useContext } from 'react';
import { SelectedQuestionnaireContext } from '../../../dashboard/contexts/SelectedQuestionnaireContext.tsx';
import useConfigStore from '../../../../stores/useConfigStore.ts';

function RendererLaunchQuestionnaireNavSection() {
  const navigate = useNavigate();
  const { closeSnackbar } = useSnackbar();
  const launchQuestionnaire = useConfigStore((state) => state.launchQuestionnaire);

  const { setSelectedQuestionnaire } = useContext(SelectedQuestionnaireContext);

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ px: 2.5, pb: 0.75 }}>
        <Typography variant="overline">Responses</Typography>
      </Box>
      <List disablePadding sx={{ px: 1 }}>
        <RendererOperationItem
          title="View Existing Responses"
          icon={<GradingIcon />}
          onClick={() => {
            closeSnackbar();
            setSelectedQuestionnaire(launchQuestionnaire);
            navigate('/dashboard/existing');
          }}
        />
      </List>
    </Box>
  );
}

export default RendererLaunchQuestionnaireNavSection;
