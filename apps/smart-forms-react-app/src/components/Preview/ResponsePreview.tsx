import React, { useContext, useRef } from 'react';
import { Box, Divider, Grid, Paper } from '@mui/material';
import Preview from './Preview';
import { MainGrid, SideBarGrid } from '../StyledComponents/Grids.styles';
import SideBar from '../SideBar/SideBar';
import { MainGridContainerBox } from '../StyledComponents/Boxes.styles';
import ChipBar from '../ChipBar/ChipBar';
import ResponsePreviewOperationButtons from '../OperationButtons/ResponsePreviewOperationButtons';
import { useReactToPrint } from 'react-to-print';
import PrintPreviewButton from '../OperationButtons/SingleButtons/PrintPreviewButton';
import { MainGridHeadingTypography } from '../StyledComponents/Typographys.styles';
import { SideBarContext } from '../../custom-contexts/SideBarContext';

function ResponsePreview() {
  const sideBar = useContext(SideBarContext);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <Grid container>
      <SideBarGrid item xs={12} lg={sideBar.isExpanded ? 1.75 : 0.5}>
        <SideBar>
          <ResponsePreviewOperationButtons />
          <PrintPreviewButton handlePrint={handlePrint} />
        </SideBar>
      </SideBarGrid>
      <MainGrid item xs={12} lg={sideBar.isExpanded ? 10.25 : 11.5}>
        <MainGridContainerBox>
          <MainGridHeadingTypography>Response Preview</MainGridHeadingTypography>
          <ChipBar>
            <ResponsePreviewOperationButtons isChip={true} />
            <PrintPreviewButton handlePrint={handlePrint} isChip={true} />
          </ChipBar>
          <Divider light />

          <Paper>
            <Box sx={{ p: 4 }} ref={componentRef}>
              <Preview />
            </Box>
          </Paper>
        </MainGridContainerBox>
      </MainGrid>
    </Grid>
  );
}

export default ResponsePreview;
