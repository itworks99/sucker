import React, {useMemo, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  Accordion,
  Container,
  Dimmer,
  Divider,
  Grid,
  Header,
  Loader,
  Segment,
  Sticky,
} from 'semantic-ui-react';
import {AboutScreen} from './components/AboutScreen';
import {AppHeader} from './components/AppHeader';
import {
  ConfirmModal,
  ConfigPreviewModal,
  ImportConfigModal,
  MultilineEditorModal,
} from './components/ConfigModal';
import {ConfigSection} from './components/ConfigSection';
import {createSearchResultRenderer} from './components/SearchResultRenderer';
import {StatusMessage} from './components/StatusMessage';
import {useSearch} from './hooks/useSearch';
import {useSquidConfig} from './hooks/useSquidConfig';
import type {SearchResult} from './types';
import {createVersionDropdownOptions, generateSquidConfiguration} from './utils/config';
import {ErrorFallback} from './components/ErrorFallback';

const SUCKER_VERSION = '0.4';

function Sucker() {
  const {
    dataJSON,
    isLoaded,
    error,
    version,
    setVersion,
    updateEntry,
    toggleEntry,
    importConfig,
  } = useSquidConfig();

  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(1);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [helpEntryId, setHelpEntryId] = useState<number>(0);
  const [openEditor, setOpenEditor] = useState(false);
  const [openImportWindow, setOpenImportWindow] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [openReloadConfirmation, setOpenReloadConfirmation] = useState(false);
  const [openWindow, setOpenWindow] = useState(false);
  const [elemContextRef, setContextRef] = useState<HTMLElement | null>(null);
  const [aboutScreenActive, setAboutScreenActive] = useState(false);
  const [configurationToImport, setConfigurationToImport] = useState('');
  const [multilineEntryId, setMultilineEntryId] = useState<number>(0);
  const [pendingVersion, setPendingVersion] = useState<string>('');

  const componentRef: Record<number, React.RefObject<any>> = {};

  const searchSource = useMemo<SearchResult[]>(() => {
    if (!dataJSON) return [];
    return dataJSON.tags.map((tag, id) => ({
      title: tag,
      record: id,
    }));
  }, [dataJSON]);

  const {loading, results, value, handleSearchChange} = useSearch(searchSource);

  const searchResultRenderer = useMemo(() => {
    return dataJSON ? createSearchResultRenderer(dataJSON) : () => null as any;
  }, [dataJSON]);

  const versionOptions = useMemo(() => {
    return dataJSON ? createVersionDropdownOptions(dataJSON.available_versions) : [];
  }, [dataJSON]);

  const handleAccordionClick = (index: number) => {
    setActiveAccordionIndex(activeAccordionIndex === index ? -1 : index);
  };

  const handleVersionChange = (newVersion: string) => {
    setPendingVersion(newVersion);
    setOpenReloadConfirmation(true);
  };

  const confirmVersionChange = () => {
    setVersion(pendingVersion);
    setOpenReloadConfirmation(false);
  };

  const handleSearchSelect = (recordNumber: number) => {
    if (!dataJSON) return;

    setActiveAccordionIndex(dataJSON.section_number[recordNumber]);
    setActiveRowIndex(recordNumber);

    if (dataJSON.switchable[recordNumber] !== 1) {
      const component = componentRef[recordNumber];
      component?.current?.focus();
    }
  };

  const handleMultilineEdit = (value: string) => {
    updateEntry(multilineEntryId, value);
  };

  const handleMultilineClick = (entryId: number) => {
    setMultilineEntryId(entryId);
    setOpenEditor(!openEditor);
  };

  const handleFocusEntry = (entryNumber: number) => {
    componentRef[entryNumber]?.current?.focus();
  };

  const handleImportClick = () => {
    setOpenImportWindow(!openImportWindow);
  };

  const handleImport = async () => {
    try {
      const message = await importConfig(configurationToImport);
      setStatusMessage(message);
      setOpenImportWindow(false);
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isLoaded || !dataJSON) {
    return (
      <Dimmer inverted active>
        <Loader inverted size="massive">
          Loading
        </Loader>
      </Dimmer>
    );
  }

  const helpTitle = dataJSON.tags[helpEntryId];
  const helpContent = dataJSON.help[helpEntryId];
  const generatedConfig = generateSquidConfiguration(dataJSON);

  return (
    <>
      <Segment>
        <AppHeader
          version={version}
          appVersion={SUCKER_VERSION}
          versionOptions={versionOptions}
          searchLoading={loading}
          searchResults={results}
          searchValue={value}
          searchResultRenderer={searchResultRenderer}
          onAboutClick={() => setAboutScreenActive(!aboutScreenActive)}
          onVersionChange={handleVersionChange}
          onSearchChange={handleSearchChange}
          onSearchSelect={handleSearchSelect}
          onPreviewClick={() => setOpenWindow(true)}
          onImportClick={handleImportClick}
        />
      </Segment>
      <Divider />
      <Grid centered columns={3}>
        <Grid.Column widescreen={4} computer={2}>
          <StatusMessage
            dataJSON={dataJSON}
            version={version}
            statusMessage={statusMessage}
          />
        </Grid.Column>
        <Grid.Column widescreen={6} computer={7}>
          <div ref={setContextRef}>
            <Container>
              <Accordion styled fluid>
                {dataJSON.all_sections.map((_, sectionIndex) => (
                  <ConfigSection
                    key={`section-${sectionIndex}`}
                    dataJSON={dataJSON}
                    sectionIndex={sectionIndex}
                    activeAccordionIndex={activeAccordionIndex}
                    activeRowIndex={activeRowIndex}
                    componentRefs={componentRef}
                    onAccordionClick={handleAccordionClick}
                    onToggleEntry={toggleEntry}
                    onValueChange={updateEntry}
                    onFocusEntry={handleFocusEntry}
                    onHelpClick={setHelpEntryId}
                    onMultilineClick={handleMultilineClick}
                  />
                ))}
              </Accordion>
            </Container>
          </div>
        </Grid.Column>
        <Grid.Column widescreen={6} computer={7}>
          <Sticky context={elemContextRef}>
            <Segment basic size="small">
              <p />
              <Header>{helpTitle}</Header>
              <pre>{helpContent}</pre>
            </Segment>
          </Sticky>
        </Grid.Column>
      </Grid>

      <ConfigPreviewModal
        open={openWindow}
        config={generatedConfig}
        onClose={() => setOpenWindow(false)}
      />

      <MultilineEditorModal
        open={openEditor}
        title={dataJSON.tags[multilineEntryId]}
        value={dataJSON.value[multilineEntryId]}
        onChange={handleMultilineEdit}
        onClose={() => setOpenEditor(false)}
      />

      <ImportConfigModal
        open={openImportWindow}
        onChange={setConfigurationToImport}
        onImport={handleImport}
        onClose={handleImportClick}
      />

      <AboutScreen
        active={aboutScreenActive}
        version={SUCKER_VERSION}
        onClose={() => setAboutScreenActive(false)}
      />

      <ConfirmModal
        open={openReloadConfirmation}
        title="Confirm reload of the Squid base configuration file"
        message="This action will reload base configuration file with the version requested. Please note that any unsaved changes are going to be lost. Do you want to proceed?"
        onConfirm={confirmVersionChange}
        onCancel={() => setOpenReloadConfirmation(false)}
      />
    </>
  );
}

export default function SuckerWithErrorBoundary() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      <Sucker />
    </ErrorBoundary>
  );
}
