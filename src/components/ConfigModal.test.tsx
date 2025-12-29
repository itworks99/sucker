import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {
  ConfigModal,
  ConfigPreviewModal,
  MultilineEditorModal,
  ImportConfigModal,
  ConfirmModal,
} from './ConfigModal';

describe('ConfigModal', () => {
  it('renders when open', () => {
    render(
      <ConfigModal open={true} icon="test" title="Test Modal" onClose={() => {}}>
        <div>Test Content</div>
      </ConfigModal>
    );
    expect(screen.getByText('Test Modal')).toBeTruthy();
    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('does not render when closed', () => {
    const {container} = render(
      <ConfigModal open={false} icon="test" title="Test Modal" onClose={() => {}}>
        <div>Test Content</div>
      </ConfigModal>
    );
    expect(container.querySelector('.visible.active')).toBeFalsy();
  });

  it('renders with icon and title', () => {
    render(
      <ConfigModal open={true} icon="copy" title="Test Modal" onClose={() => {}}>
        <div>Content</div>
      </ConfigModal>
    );
    expect(screen.getByText('Test Modal')).toBeTruthy();
  });
});

describe('ConfigPreviewModal', () => {
  const mockConfig = 'http_port 3128\ncache_dir ufs /var/spool/squid 100 16 256';

  it('renders preview modal with config', () => {
    render(<ConfigPreviewModal open={true} config={mockConfig} onClose={() => {}} />);
    expect(screen.getByText('New configuration')).toBeTruthy();
  });

  it('renders without crashing when open', () => {
    const {container} = render(
      <ConfigPreviewModal open={true} config={mockConfig} onClose={() => {}} />
    );
    expect(container).toBeTruthy();
  });

  it('renders close button', () => {
    render(<ConfigPreviewModal open={true} config={mockConfig} onClose={() => {}} />);
    expect(screen.getByText('close')).toBeTruthy();
  });

  it('displays usage instructions', () => {
    render(<ConfigPreviewModal open={true} config={mockConfig} onClose={() => {}} />);
    expect(screen.getByText(/To use:/)).toBeTruthy();
  });
});

describe('MultilineEditorModal', () => {
  it('renders editor modal', () => {
    render(
      <MultilineEditorModal
        open={true}
        title="Edit ACL"
        value="test value"
        onChange={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Edit ACL')).toBeTruthy();
  });

  it('renders with buttons', () => {
    render(
      <MultilineEditorModal
        open={true}
        title="Edit"
        value="default content"
        onChange={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Edit')).toBeTruthy();
  });

  it('renders save and revert buttons', () => {
    render(
      <MultilineEditorModal
        open={true}
        title="Edit"
        value=""
        onChange={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Revert to default')).toBeTruthy();
    expect(screen.getByText('Save and close')).toBeTruthy();
  });
});

describe('ImportConfigModal', () => {
  it('renders import modal', () => {
    render(
      <ImportConfigModal
        open={true}
        onChange={() => {}}
        onImport={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Import existing configuration')).toBeTruthy();
  });

  it('displays import instructions', () => {
    render(
      <ImportConfigModal
        open={true}
        onChange={() => {}}
        onImport={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/To import:/)).toBeTruthy();
  });

  it('renders close and import buttons', () => {
    render(
      <ImportConfigModal
        open={true}
        onChange={() => {}}
        onImport={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Close')).toBeTruthy();
    expect(screen.getByText('Import')).toBeTruthy();
  });

  it('renders modal header', () => {
    render(
      <ImportConfigModal
        open={true}
        onChange={() => {}}
        onImport={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Import existing configuration')).toBeTruthy();
  });
});

describe('ConfirmModal', () => {
  it('renders confirm modal', () => {
    render(
      <ConfirmModal
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Confirm Action')).toBeTruthy();
    expect(screen.getByText('Are you sure?')).toBeTruthy();
  });

  it('renders yes and no buttons', () => {
    render(
      <ConfirmModal
        open={true}
        title="Confirm"
        message="Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('yes')).toBeTruthy();
    expect(screen.getByText('no')).toBeTruthy();
  });

  it('displays custom message', () => {
    const customMessage = 'This action will reload the configuration. Do you want to proceed?';
    render(
      <ConfirmModal
        open={true}
        title="Reload"
        message={customMessage}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText(customMessage)).toBeTruthy();
  });
});
