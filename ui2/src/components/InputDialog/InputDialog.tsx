import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export interface RegularField {
  label: string
  type: "text" | "number" | "date"
}

export interface SelectionField {
  label: string
  type: "selection"
  items: string[]
}

export interface CheckBoxField {
  label: string
  type: "checkbox"
}

export type Field = RegularField | SelectionField | CheckBoxField

export interface InputDialogProps<T extends { [key: string]: any }> {
  open: boolean
  title: string
  defaultValue: T
  fields: Record<keyof T, Field>
  onClose: (state: T | null) => Promise<void>
}

export function InputDialog<T extends { [key: string]: any }>(props: InputDialogProps<T>) {
  const [state, setState] = useState<T>(props.defaultValue);

  useEffect(() =>
    setState(props.defaultValue)
  , [props.defaultValue])

  function fieldsToInput([fieldName, field]: [string, Field], index: number): JSX.Element {
    if (field.type === "selection") {
      return (
        <FormControl key={index} fullWidth>
          <InputLabel required>{field.label}</InputLabel>
          <Select
            value={state[fieldName]}
            defaultValue={""}
            onChange={e => setState({ ...state, [fieldName]: e.target.value })}>
            {field.items.map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
          </Select>
        </FormControl>
      )
    } else if (field.type === "checkbox") {
      return (
        <FormControl key={index} fullWidth>
          <FormControlLabel
            key={index}
            label={field.label}
            control={
              <Checkbox
                color="primary"
                onChange={e => setState({ ...state, [fieldName]: e.target.checked })}
              />}
          />
        </FormControl>
      )
    } else {
      return (
        <TextField
          required
          autoFocus
          fullWidth
          key={index}
          label={field.label}
          type={field.type}
          onChange={e => setState({ ...state, [fieldName]: e.target.value })}
          InputLabelProps={{
            shrink: true,
            required: true,
          }}
          placeholder={(field.type === "date") ? "YYYY-MM-DD" : ""}
        />
      )
    }
  }
  const fieldsAsArray: [string, Field][] = Object.entries(props.fields);

  return (
    <Dialog open={props.open} onClose={() => props.onClose(null)} maxWidth="sm" fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{fieldsAsArray.map((value, index) => fieldsToInput(value, index))}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(state)} color="primary">Confirm</Button>
        <Button onClick={() => props.onClose(null)} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}