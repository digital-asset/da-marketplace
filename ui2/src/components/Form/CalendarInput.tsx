import React from 'react';
import { Form } from 'semantic-ui-react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

type Props = {
  value: string | Date | undefined | null;
  onChange: (e: any) => void;
}

const CalendarInput: React.FC<Props> = ({ value, onChange }) => {
  return <Form.Input fluid className='calendar-input'>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        fullWidth
        disableToolbar
        variant="inline"
        format="yyyy-MM-dd"
        margin="normal"
        label="Expiry Date"
        defaultValue=""
        value={value}
        onChange={onChange} />
    </MuiPickersUtilsProvider>
  </Form.Input>
};

export default CalendarInput;
