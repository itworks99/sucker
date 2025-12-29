
import type React from 'react';
import {Button, Form, Icon, Modal, TextArea} from 'semantic-ui-react';

interface ConfigModalProps {
  open: boolean;
  icon: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function ConfigModal({open, icon, title, children, onClose}: ConfigModalProps) {
  return (
    <Modal dimmer="inverted" open={open} closeOnEscape onClose={onClose}>
      <Modal.Header>
        <Icon name={icon as any} />
        {title}
      </Modal.Header>
      {children}
    </Modal>
  );
}

interface ConfigPreviewModalProps {
  open: boolean;
  config: string;
  onClose: () => void;
}

export function ConfigPreviewModal({open, config, onClose}: ConfigPreviewModalProps) {
  return (
    <ConfigModal open={open} icon="copy" title="New configuration" onClose={onClose}>
      <Modal.Content scrolling>
        <Form>
          <Form.Field>
            <p>
              <b>To use:</b> copy configuration from the text area below and save
              it as squid.conf in the location of the original configuration file.
              By default, this file is located at <b>/etc/squid/squid.conf</b> or{' '}
              <b>/usr/local/squid/etc/squid.conf</b>.
            </p>
            <TextArea rows={20} value={config} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative size="large" onClick={onClose}>
          close
        </Button>
      </Modal.Actions>
    </ConfigModal>
  );
}

interface MultilineEditorModalProps {
  open: boolean;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function MultilineEditorModal({
  open,
  title,
  value,
  onChange,
  onClose,
}: MultilineEditorModalProps) {
  return (
    <ConfigModal open={open} icon="edit" title={title} onClose={onClose}>
      <Modal.Content scrolling>
        <Form>
          <Form.Field>
            <TextArea
              rows={20}
              defaultValue={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button type="reset" secondary>
          Revert to default
        </Button>
        <Button secondary onClick={onClose}>
          Save and close
        </Button>
      </Modal.Actions>
    </ConfigModal>
  );
}

interface ImportConfigModalProps {
  open: boolean;
  onChange: (value: string) => void;
  onImport: () => void;
  onClose: () => void;
}

export function ImportConfigModal({open, onChange, onImport, onClose}: ImportConfigModalProps) {
  return (
    <ConfigModal open={open} icon="paste" title="Import existing configuration" onClose={onClose}>
      <Modal.Content scrolling>
        <p>
          <b>To import:</b> copy and paste contents of <b>squid.conf</b> into the
          window below. By default, this file is located at{' '}
          <b>/etc/squid/squid.conf</b> or <b>/usr/local/squid/etc/squid.conf</b>.
        </p>
        <p>
          <b>Please note:</b> lines that begin with &apos;#&apos; (i.e. commented
          out) are not going to be processed.
        </p>
        <Form>
          <Form.TextArea
            control="textarea"
            onChange={(e) => onChange(e.target.value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button secondary onClick={onClose}>
          Close
        </Button>
        <Button secondary type="submit" onClick={onImport}>
          Import
        </Button>
      </Modal.Actions>
    </ConfigModal>
  );
}

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({open, title, message, onConfirm, onCancel}: ConfirmModalProps) {
  return (
    <ConfigModal open={open} icon="question" title={title} onClose={onCancel}>
      <Modal.Content>{message}</Modal.Content>
      <Modal.Actions>
        <Button negative onClick={onCancel}>
          no
        </Button>
        <Button positive onClick={onConfirm}>
          yes
        </Button>
      </Modal.Actions>
    </ConfigModal>
  );
}
