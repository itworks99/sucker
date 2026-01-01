
import type React from 'react';
import {Container, Dropdown, Header, Icon, Menu, Search} from 'semantic-ui-react';
import type {SearchResult} from '../types';

interface AppHeaderProps {
  version: string;
  appVersion: string;
  versionOptions: Array<{key: number; text: string; value: string}>;
  searchLoading: boolean;
  searchResults: SearchResult[];
  searchValue: string;
  searchResultRenderer: (result: SearchResult) => React.ReactElement;
  onAboutClick: () => void;
  onVersionChange: (version: string) => void;
  onSearchChange: (value: string) => void;
  onSearchSelect: (recordNumber: number) => void;
  onPreviewClick: () => void;
  onImportClick: () => void;
}

const COLORS = {
  purple: 'purple',
} as const;

export function AppHeader({
  version,
  appVersion,
  versionOptions,
  searchLoading,
  searchResults,
  searchValue,
  searchResultRenderer,
  onAboutClick,
  onVersionChange,
  onSearchChange,
  onSearchSelect,
  onPreviewClick,
  onImportClick,
}: AppHeaderProps) {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as="a" header onClick={onAboutClick}>
          <Header inverted as="h3">
            <Icon inverted name="circle outline" color={COLORS.purple} size="big" />
            <Header.Content>Sucker {appVersion}</Header.Content>
            <Header.Subheader>Squid configuration editor</Header.Subheader>
          </Header>
        </Menu.Item>
        <Menu.Item as="a">
          <Search
            placeholder="Search tags"
            minCharacters={2}
            loading={searchLoading}
            onResultSelect={(_e, data) => {
              const result = data.result as SearchResult;
              onSearchSelect(result.record);
            }}
            onSearchChange={(_e, data) => onSearchChange(data.value as string)}
            resultRenderer={searchResultRenderer as any}
            results={searchResults}
            value={searchValue}
          />
        </Menu.Item>
        <Menu.Item>
          <Header inverted as="h5">
            Squid version{' '}
            <Dropdown
              options={versionOptions}
              inline
              value={version || undefined}
              onChange={(_e, data) => onVersionChange(data.value as string)}
            />
          </Header>
        </Menu.Item>
        <Menu.Item as="a" onClick={onPreviewClick}>
          <Header inverted as="h5">
            <Icon name="magic" />
            Show
          </Header>
        </Menu.Item>
        <Menu.Item as="a" onClick={onImportClick}>
          <Header inverted as="h5">
            <Icon name="download" />
            Import
          </Header>
        </Menu.Item>
      </Container>
    </Menu>
  );
}
