import { Box, List, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import React from 'react';
import { StyledNavItemIcon } from '../../StyledComponents/NavSection.styles';
import RendererBackToHome from './RendererBackToHome';

export interface NavButton {
  title: string;
  icon: JSX.Element;
  disabled?: boolean;
  onClick: () => unknown;
}

function RendererNavSection() {
  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ px: 2.5, pb: 0.75 }}>
        <Typography variant="overline">Pages</Typography>
      </Box>
      <List disablePadding sx={{ px: 1 }}>
        <RendererBackToHome />
      </List>
    </Box>
  );
}

export function NavItem(props: NavButton) {
  const { title, icon, disabled, onClick } = props;
  const theme = useTheme();

  return (
    <ListItemButton
      disableGutters
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...theme.typography.subtitle2,
        height: 48,
        textTransform: 'capitalize',
        color: theme.palette.text.secondary,
        borderRadius: Number(theme.shape.borderRadius) * 0.2
      }}>
      <StyledNavItemIcon>{icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />
    </ListItemButton>
  );
}

export default RendererNavSection;
