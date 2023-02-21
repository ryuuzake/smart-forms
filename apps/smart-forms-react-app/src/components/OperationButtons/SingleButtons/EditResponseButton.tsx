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

import React, { useContext } from 'react';
import { Box, ListItemButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListItemText from '@mui/material/ListItemText';
import { PageType } from '../../../interfaces/Enums';
import { OperationChip } from '../../ChipBar/ChipBar.styles';
import { PageSwitcherContext } from '../../../custom-contexts/PageSwitcherContext';
import { SideBarContext } from '../../../custom-contexts/SideBarContext';
import { SideBarIconButton } from '../../SideBar/SideBarBottom.styles';

interface Props {
  isChip?: boolean;
}

function EditResponseButton(props: Props) {
  const { isChip } = props;
  const { goToPage } = useContext(PageSwitcherContext);
  const { sideBarIsExpanded } = useContext(SideBarContext);

  function handleClick() {
    goToPage(PageType.Renderer);
  }

  const buttonTitle = 'Edit Response';

  const renderButton = (
    <ListItemButton onClick={handleClick}>
      <EditIcon sx={{ mr: 2 }} />
      <ListItemText
        primary={
          <Typography fontSize={12} variant="h6">
            {buttonTitle}
          </Typography>
        }
      />
    </ListItemButton>
  );

  const renderChip = (
    <OperationChip
      icon={<EditIcon fontSize="small" />}
      label={buttonTitle}
      clickable
      onClick={handleClick}
    />
  );

  const renderIconButton = (
    <Box sx={{ m: 0.5 }}>
      <Tooltip title={buttonTitle} placement="right">
        <span>
          <SideBarIconButton onClick={handleClick}>
            <EditIcon />
          </SideBarIconButton>
        </span>
      </Tooltip>
    </Box>
  );

  return <>{isChip ? renderChip : sideBarIsExpanded ? renderButton : renderIconButton}</>;
}

export default EditResponseButton;
