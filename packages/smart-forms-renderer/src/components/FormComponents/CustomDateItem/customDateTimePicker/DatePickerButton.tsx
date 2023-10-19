import React from 'react';
import type {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection
} from '@mui/x-date-pickers/models';
import type { Dayjs } from 'dayjs';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event';

interface DatePickerButtonProps
  extends BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, DateValidationError> {
  onOpen?: () => void;
}

function DatePickerButton(props: DatePickerButtonProps) {
  const { onOpen } = props;

  return (
    <IconButton
      sx={{ height: 24, width: 24 }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen?.();
      }}>
      <EventIcon fontSize="small" />
    </IconButton>
  );
}

export default DatePickerButton;
