
import type React from 'react';
import {Button, Checkbox, Dropdown, Form, Icon, Input, Label, Popup, Table} from 'semantic-ui-react';
import {createSwitchOptions} from '../utils/config';

interface ConfigEntryProps {
  entryNumber: number;
  tag: string;
  value: string;
  isEnabled: boolean;
  switchable: number;
  switchPosition: number;
  unit: string;
  messageBuilt: string;
  messageWarning: string;
  isActive: boolean;
  componentRef: React.RefObject<any>;
  onToggle: (index: number) => void;
  onValueChange: (index: number, value: string) => void;
  onFocus: (index: number) => void;
  onHelpClick: (index: number) => void;
  onMultilineClick: (index: number) => void;
}

const COLORS = {
  blue: 'blue',
  pink: 'pink',
} as const;

export function ConfigEntry({
  entryNumber,
  tag,
  value,
  isEnabled,
  switchable,
  switchPosition,
  unit,
  messageBuilt,
  messageWarning,
  isActive,
  componentRef,
  onToggle,
  onValueChange,
  onFocus,
  onHelpClick,
  onMultilineClick,
}: ConfigEntryProps) {
  let tagComponent: React.ReactNode = null;

  if (!switchable) {
    // Regular text input
    const unitLabel = unit ? <Label basic content={unit} horizontal /> : null;

    tagComponent = (
      <Form>
        <Form.Field>
          <Input
            fluid
            ref={componentRef}
            entrynumber={entryNumber}
            defaultValue={`${value} `}
            onChange={(_e, {value: newValue}) => onValueChange(entryNumber, newValue)}
            labelPosition="right"
            type="text"
            action
          >
            <input />
            {unitLabel}
            <Button basic type="reset" entrynumber={entryNumber} onClick={() => onFocus(entryNumber)}>
              Reset
            </Button>
          </Input>
        </Form.Field>
      </Form>
    );
  } else if (switchable === 1) {
    // On/Off dropdown
    const options = createSwitchOptions(tag);
    tagComponent = (
      <Dropdown
        ref={componentRef}
        entrynumber={entryNumber}
        fluid
        selection
        options={options}
        defaultValue={options[switchPosition].value}
        onChange={(_e, {value: newValue}) => onValueChange(entryNumber, newValue as string)}
      />
    );
  } else if (switchable === 2) {
    // Multiline editor button
    tagComponent = (
      <Button
        ref={componentRef}
        secondary
        compact
        value={entryNumber}
        onClick={() => onMultilineClick(entryNumber)}
      >
        {tag} - Click to edit
      </Button>
    );
  }

  const warningBuilt = messageBuilt ? (
    <Popup
      trigger={<Icon color={COLORS.blue} name="warning sign" />}
      content={`Only available if Squid is compiled with the ${messageBuilt}`}
    />
  ) : null;

  const warningMessage = messageWarning ? (
    <Popup
      trigger={<Icon color={COLORS.pink} name="warning sign" />}
      content={messageWarning}
    />
  ) : null;

  return (
    <Table.Row active={isActive}>
      <Table.Cell width={1}>
        <Checkbox
          value={entryNumber}
          defaultChecked={isEnabled}
          slider
          onClick={() => onToggle(entryNumber)}
        />
      </Table.Cell>
      <Table.Cell>{tagComponent}</Table.Cell>
      <Table.Cell width={2}>
        {warningBuilt}
        {warningMessage}
      </Table.Cell>
      <Table.Cell width={1} textAlign="left">
        <Button
          value={entryNumber}
          compact
          circular
          onClick={() => onHelpClick(entryNumber)}
          icon="help"
        />
      </Table.Cell>
    </Table.Row>
  );
}
