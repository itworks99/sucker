
import {Icon, Message} from 'semantic-ui-react';
import type {DataJSON} from '../types';

interface StatusMessageProps {
  dataJSON: DataJSON;
  version: string;
  statusMessage: string;
}

const COLORS = {
  grey: 'grey',
  purple: 'purple',
} as const;

export function StatusMessage({dataJSON, version, statusMessage}: StatusMessageProps) {
  return (
    <Message color={COLORS.grey}>
      <p>
        Loaded configuration for Squid ver. <b>{version}</b>
      </p>
      <p>
        <b>{dataJSON.tags.length}</b> unique tags in{' '}
        <b>{dataJSON.all_sections.length}</b> sections
      </p>
      <p>{statusMessage}</p>
      <p>Legend:</p>
      <p>
        <Icon name="tags" /> - selected section
      </p>
      <p>
        <Icon name="tags" color={COLORS.grey} /> - section without enabled options
      </p>
      <p>
        <Icon name="tags" color={COLORS.purple} /> - section with enabled options
      </p>
    </Message>
  );
}
