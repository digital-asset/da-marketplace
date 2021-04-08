import React from 'react';
import { Form } from 'semantic-ui-react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

type Props = {
  label?: string;
  placeholder?: string;
  value: string | Date | undefined | null;
  onChange: (e: any) => void;
};

const CalendarInput: React.FC<Props> = ({ value, label, placeholder, onChange }) => (
  <Form.Input fluid className="calendar-input" label={label} placeholder={placeholder}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        fullWidth
        disableToolbar
        variant="inline"
        format="yyyy-MM-dd"
        margin="normal"
        label=""
        placeholder={placeholder}
        PopoverProps={{
          anchorOrigin: { horizontal: 'right', vertical: 'top' },
          transformOrigin: { horizontal: 'right', vertical: 'top' },
        }}
        defaultValue=""
        value={value}
        onChange={onChange}
      />
    </MuiPickersUtilsProvider>
  </Form.Input>
);

export default CalendarInput;
