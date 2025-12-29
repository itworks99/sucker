import React, {useEffect, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {
  Accordion,
  Button,
  Checkbox,
  Container,
  Dimmer,
  Divider,
  Dropdown,
  DropdownProps,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Loader,
  Menu,
  Message,
  Modal,
  Popup,
  Search,
  SearchProps,
  SearchResultData,
  Segment,
  Sticky,
  Table,
  TextArea,
} from 'semantic-ui-react';
import type {DataJSON, SearchAction, SearchResult, SearchState} from './types';

const suckerVersionString = '0.4';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({error, resetErrorBoundary}: ErrorFallbackProps) {
  return (
    <Container style={{marginTop: '2em'}}>
      <Message negative>
        <Message.Header>
          <Icon name="warning sign"/>
          Something went wrong
        </Message.Header>
        <p>An error occurred while rendering the application.</p>
        <Divider/>
        <details style={{whiteSpace: 'pre-wrap'}}>
          <summary>Error details</summary>
          {error.toString()}
        </details>
        <Divider/>
        <Button negative onClick={resetErrorBoundary}>
          Reload Application
        </Button>
      </Message>
    </Container>
  );
}

function Sucker() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(1);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [helpEntryId, setHelpEntryId] = useState<number>(0);
  const [openEditor, setOpenEditor] = useState(false);
  const [openImportWindow, setOpenImportWindow] = useState(false);
  const [dataJSON, setDataJSON] = useState<DataJSON | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [version, setVersion] = useState('');
  const [openReloadConfirmation, setOpenReloadConfirmation] = useState(false);
  const [openWindow, setOpenWindow] = useState(false);
  const [elemContextRef, setContextRef] = useState<HTMLElement | null>(null);
  const [aboutScreenActive, setAboutScreenActive] = useState(false);
  const [configurationToImport, setConfigurationToImport] = useState('');
  const [multilineEntryId, setMultilineEntryId] = useState<number>(0);
  const [err, setError] = useState<Error | null>(null);

  const componentRef: Record<number, React.RefObject<any>> = {};

  const source = React.useMemo<SearchResult[]>(() => {
    if (!dataJSON) return [];
    return dataJSON.tags.map((tag, id) => ({
      title: tag,
      record: id,
    }));
  }, [dataJSON]);

  function handleImportWindow() {
    setOpenImportWindow(!openImportWindow);
  }

  function handleMultilineEdit(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (dataJSON) {
      const newData = {...dataJSON};
      newData.value[multilineEntryId] = e.target.value;
      setDataJSON(newData);
    }
  }

  function handleVersionDropdownClick(_e: React.SyntheticEvent, data: DropdownProps) {
    const ver = data.value as string;
    setVersion(ver);
    setOpenReloadConfirmation(true);
  }

  function handleEntrySliderClick(e: React.MouseEvent<HTMLInputElement>) {
    const index = Number((e.target as HTMLInputElement).value);
    if (dataJSON) {
      const newData = {...dataJSON};
      newData.is_enabled[index] = newData.is_enabled[index] ? 0 : 1;
      setDataJSON(newData);
    }
  }

  function handleHelpButtonClick(_e: React.MouseEvent<HTMLButtonElement>, value: {value: number}) {
    setHelpEntryId(value.value);
  }

  const handleClick = (_e: React.MouseEvent, titleProps: {index: number}) => {
    const {index} = titleProps;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    setActiveAccordionIndex(newIndex);
  };

  function handleConfigPreview() {
    setOpenWindow(true);
  }

  function handleAboutWindow() {
    setAboutScreenActive(!aboutScreenActive);
  }

  function handleContextRef(contextRef: HTMLElement | null) {
    setContextRef(contextRef);
  }

  useEffect(() => {
    function loadConfigurationFile(httpRequestMethod: string, fetchUrl: string) {
      let body: string | undefined;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
                    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Request-Headers':
                    'X-Requested-With, Content-Type, Accept, access-control-allow-headers, X-CSRF-Token, access-control-allow-methods, access-control-allow-origin',
      };
      if (fetchUrl.endsWith('version')) {
        body = JSON.stringify({version});
      }
      fetch(fetchUrl, {
        method: httpRequestMethod,
        headers,
        body,
      })
        .then((response) => response.json())
        .then((json) => {
          setDataJSON(json);
          setIsLoaded(true);
        })
        .catch((error) => {
          setError(error);
        });
      return setOpenReloadConfirmation(false);
    }

    if (version === '') {
      loadConfigurationFile('GET', '/json');
    } else {
      loadConfigurationFile('POST', '/version');
    }

    return function cleanup() {
      setIsLoaded(false);
    };
  }, [version]);

  function importConfiguration() {
    fetch('/import', {
      method: 'POST',
      body: configurationToImport,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
      .then(() => setIsLoaded(false))
      .then((response) => response?.json())
      .then((json) => {
        if (!dataJSON) return;

        let message = '';
        let messageList = '';
        let counter = 0;
        let z = 0;
        const newData = {...dataJSON};

        for (z = 0; z < json.id.length; z += 1) {
          newData.is_enabled[z] = 0;
        }
        for (z = 0; z < json.id.length; z += 1) {
          const position = json.id[z];
          if (json.id[z] === 999) {
            messageList = `${messageList} ${json.tags[z]};`;
          } else {
            newData.is_enabled[position] = 1;
            newData.value[position] = json.value[z];
            newData.switchable[position] = json.switchable[z];
            newData.switch_position[position] = json.switch_position[z];
            counter += 1;
          }
        }
        if (messageList !== '') {
          messageList = ` The following entries were skipped as they are not being present in current version:${messageList}`;
        }
        message = `Import completed: ${json.id.length} entries processed, ${counter} recognized.${messageList}`;
        setDataJSON(newData);
        setOpenImportWindow(false);
        setStatusMessage(message);
        setIsLoaded(true);
      });
  }

  function closeDialogWindow() {
    setOpenWindow(false);
  }

  function readValueFromComponent(_e: React.SyntheticEvent, {entrynumber, value}: {entrynumber: number; value: string}) {
    if (dataJSON) {
      const newData = {...dataJSON};
      newData.value[entrynumber] = value;
      setDataJSON(newData);
    }
  }

  function readConfigurationToImport(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setConfigurationToImport(e.target.value);
  }

  function displayMultilineEditor(e: React.MouseEvent<HTMLButtonElement>) {
    setMultilineEntryId(Number((e.target as HTMLButtonElement).value));
    setOpenEditor(!openEditor);
  }

  function closeReloadConfirmationWindow() {
    setOpenReloadConfirmation(false);
  }

  function focusOnComponent(_e: React.MouseEvent, {entrynumber}: {entrynumber: number}) {
    const component = componentRef[entrynumber];
    if (component?.current) {
      component.current.focus();
    }
  }

  function focusTextInput(_e: React.MouseEvent, data: SearchResultData) {
    const recordNumber = (data.result as SearchResult).record;
    if (!dataJSON) return;

    setActiveAccordionIndex(dataJSON.section_number[recordNumber]);
    setActiveRowIndex(recordNumber);
    if (dataJSON.switchable[recordNumber] !== 1) {
      const component = componentRef[recordNumber];
      if (component?.current) {
        component.current.focus();
      }
    }
  }

  const greyColor = 'grey' as const;
  const primaryAccentColor = 'purple' as const;
  const pinkColor = 'pink' as const;
  const blueColor = 'blue' as const;

  const searchResultsRenderer = ({title, record}: SearchResult) => {
    if (!dataJSON) return null;

    const SearchSubheader = (
      <Header.Subheader>
        {dataJSON.all_sections[dataJSON.section_number[record]].toLowerCase()}
      </Header.Subheader>
    );
    return (
      <Header key={record} size="tiny">
        {title}
        {SearchSubheader}
      </Header>
    );
  };

  const initialSearchState: SearchState = {
    loading: false,
    results: [],
    value: '',
  };

  function SearchReducer(state: SearchState, action: SearchAction): SearchState {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return initialSearchState;
      case 'START_SEARCH':
        return {...state, loading: true, value: action.query};
      case 'FINISH_SEARCH':
        return {...state, loading: false, results: action.results};

      default:
        return state;
    }
  }

  const modalWindowRenderer = (onOpen: boolean, icon: string, HeaderContent: React.ReactNode, modalcontent: React.ReactNode) => {
    return (
      <Modal
        dimmer="inverted"
        open={onOpen}
        closeOnEscape
        onClose={closeDialogWindow}
      >
        <Modal.Header>
          <Icon name={icon as any}/>
          <>{HeaderContent}</>
        </Modal.Header>
        {modalcontent}
      </Modal>
    );
  };

  const statusMessageBox = () => {
    if (!dataJSON) return null;

    return (
      <Message color={greyColor}>
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
          <Icon name="tags"/> - selected section
        </p>
        <p>
          <Icon name="tags" color={greyColor}/> - section without enabled
          options
        </p>
        <p>
          <Icon name="tags" color={primaryAccentColor}/> - section with enabled
          options
        </p>
      </Message>
    );
  };

  function versionDropdownOptions() {
    if (!dataJSON) return [];

    const options = [];
    for (let i = 0; i < dataJSON.available_versions.length; i += 1) {
      options.push({
        key: i,
        text: dataJSON.available_versions[i],
        value: dataJSON.available_versions[i],
      });
    }
    return options;
  }

  function createAccordionSections() {
    const AccordionContent: React.ReactNode[] = [];

    function getOptions(keys: string[], tag: string) {
      return Array.from(keys, (key) => ({
        key: `${tag} ${key}`,
        text: `${tag} ${key}`,
        value: `${tag} ${key}`,
      }));
    }

    if (dataJSON) {
      let n = 0;
      let tagEntryKey = 0;
      let warningBuiltWithHover: React.ReactNode = '';
      let warningMessageHover: React.ReactNode = '';
      let tagComponentUnitLabel: React.ReactNode = '';
      const AccordionIconColors: string[] = [];

      for (let i = 0; i < dataJSON.all_sections.length; i += 1) {
        const SectionContentsPopup: string[] = [];
        const TableContentInSection: React.ReactNode[] = [];
        SectionContentsPopup[i] = '';

        while (dataJSON.section_number[n] === i) {
          if (dataJSON.is_enabled[n] > 0) {
            AccordionIconColors[i] = primaryAccentColor;
          }

          let tagRepresentationComponent: React.ReactNode = '';
          SectionContentsPopup[i] += `${dataJSON.tags[n]}\n`;

          if (!componentRef[n]) {
            componentRef[n] = React.createRef();
          }
          const reference = componentRef[n];

          if (!dataJSON.switchable[n]) {
            if (dataJSON.units[n]) {
              tagComponentUnitLabel = (
                <>
                  <Label basic content={dataJSON.units[n]} horizontal/>
                </>
              );
            } else {
              tagComponentUnitLabel = '';
            }
            // Regular tag
            tagRepresentationComponent = (
              <>
                <Form>
                  <Form.Field>
                    <Input
                      fluid
                      ref={reference}
                      entrynumber={tagEntryKey}
                      defaultValue={`${dataJSON.value[n]} `}
                      onChange={readValueFromComponent}
                      labelPosition="right"
                      type="text"
                      action
                    >
                      <input/>
                      {tagComponentUnitLabel}
                      <Button
                        basic
                        type="reset"
                        entrynumber={tagEntryKey}
                        onClick={focusOnComponent}
                      >
                        Reset
                      </Button>
                    </Input>
                  </Form.Field>
                </Form>
              </>
            );
            // Tag with on/off selection
          } else if (dataJSON.switchable[n] === 1) {
            const tag = dataJSON.tags[n];
            const options = getOptions(['on', 'off'], tag);
            tagRepresentationComponent = (
              <>
                <Dropdown
                  ref={reference}
                  entrynumber={tagEntryKey}
                  fluid
                  selection
                  options={options}
                  defaultValue={options[dataJSON.switch_position[n]].value}
                  onChange={readValueFromComponent}
                />
              </>
            );
          } else if (dataJSON.switchable[n] === 2) {
            tagRepresentationComponent = (
              <>
                <Button
                  ref={reference}
                  secondary
                  compact
                  value={n}
                  onClick={displayMultilineEditor}
                >
                  {dataJSON.tags[n]} - Click to edit
                </Button>
              </>
            );
          }

          warningBuiltWithHover = '';

          if (dataJSON.message_built[n]) {
            warningBuiltWithHover = (
              <>
                <Popup
                  trigger={<Icon color={blueColor} name="warning sign"/>}
                  content={`Only available if Squid is compiled with the ${dataJSON.message_built[n]}`}
                />
              </>
            );
          }

          warningMessageHover = '';

          if (dataJSON.message_warning[n]) {
            warningMessageHover = (
              <>
                <Popup
                  trigger={<Icon color={pinkColor} name="warning sign"/>}
                  content={dataJSON.message_warning[n]}
                />
              </>
            );
          }

          let defaultRecordChecked = false;
          if (dataJSON.is_enabled[n] > 0) {
            defaultRecordChecked = true;
          }
          TableContentInSection[n] = (
            <Table.Row key={`tableKey${n}`} active={activeRowIndex === n}>
              <Table.Cell width={1}>
                <Checkbox
                  value={tagEntryKey}
                  id={`checkboxEntry${(tagEntryKey += 1)}`}
                  defaultChecked={defaultRecordChecked}
                  slider
                  onClick={handleEntrySliderClick}
                />
              </Table.Cell>
              <Table.Cell>{tagRepresentationComponent}</Table.Cell>
              <Table.Cell width={2}>
                {warningBuiltWithHover}
                {warningMessageHover}
              </Table.Cell>
              <Table.Cell width={1} textAlign="left">
                <Button
                  value={tagEntryKey}
                  compact
                  circular
                  active={aboutScreenActive}
                  onClick={handleHelpButtonClick}
                  icon="help"
                />
              </Table.Cell>
            </Table.Row>
          );
          n += 1;
        }

        AccordionContent[i] = (
          <Container key={`containerKey${i}`}>
            <Accordion.Title
              active={activeAccordionIndex === i}
              index={i}
              onClick={handleClick}
            >
              <>
                <Popup
                  trigger={<Icon name="dropdown"/>}
                  size="tiny"
                  position="left center"
                  header="Tags in this section:"
                  content={
                    <Grid centered columns={1}>
                      <Grid.Column textAlign="left">
                        <pre>{SectionContentsPopup[i]}</pre>
                      </Grid.Column>
                    </Grid>
                  }
                />
              </>
              <Icon name="tags" color={AccordionIconColors[i] as any}/>
                            &nbsp;
              {dataJSON.all_sections[i]}
            </Accordion.Title>
            <Accordion.Content active={activeAccordionIndex === i}>
              <Table striped compact basic="very">
                <Table.Body>{TableContentInSection}</Table.Body>
              </Table>
            </Accordion.Content>
          </Container>
        );
      }
    }
    return AccordionContent;
  }

  function generateSquidConfiguration() {
    if (!dataJSON) return '';

    let generatedSquidConfiguration = '';
    for (let i = 0; i < dataJSON.section_number.length; i += 1) {
      if (dataJSON.is_enabled[i])
        generatedSquidConfiguration = `${generatedSquidConfiguration}\n${dataJSON.value[i]}`;
    }
    return generatedSquidConfiguration;
  }

  // Handle search box
  const [state, dispatch] = React.useReducer(SearchReducer, initialSearchState);
  const {loading, results, value} = state;

  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const handleSearchChange = React.useCallback(
    (_e: React.MouseEvent, data: SearchProps) => {
      clearTimeout(timeoutRef.current);
      dispatch({type: 'START_SEARCH', query: data.value as string});

      function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      timeoutRef.current = setTimeout(() => {
        if ((data.value as string).length < 1) {
          dispatch({type: 'CLEAN_QUERY'});
          return;
        }
        const re = new RegExp(escapeRegExp(data.value as string), 'i');
        const isMatch = (result: SearchResult) => re.test(result.title);
        const res = source.filter(isMatch);
        dispatch({
          type: 'FINISH_SEARCH',
          results: res,
        });
      }, 300);
    },
    [source],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
  }, [helpEntryId]);

  if (err) {
    return <div>Error: {err.message}</div>;
  }

  let output: React.ReactNode = '';

  if (isLoaded === false || !dataJSON || dataJSON.tags === undefined) {
    output = (
      <>
        <Dimmer inverted active={!isLoaded}>
          <Loader inverted size="massive">
            Loading
          </Loader>
        </Dimmer>
      </>
    );
  } else {
    if (version === '' && dataJSON.squid_version.length > 0) {
      setVersion(dataJSON.squid_version[0]);
    }

    const helpTitle = dataJSON.tags[helpEntryId - 1];
    const helpContent = dataJSON.help[helpEntryId - 1];

    output = (
      <>
        <Segment>
          <Menu fixed="top" inverted>
            <Container>
              <Menu.Item as="a" header onClick={handleAboutWindow}>
                <Header inverted as="h3">
                  <Icon
                    inverted
                    name="circle outline"
                    color={primaryAccentColor}
                    size="big"
                  />
                  <Header.Content>Sucker {suckerVersionString}</Header.Content>
                  <Header.Subheader>
                    Squid configuration editor
                  </Header.Subheader>
                </Header>
              </Menu.Item>
              <Menu.Item as="a">
                <Search
                  placeholder="Search tags"
                  minCharacters={2}
                  loading={loading}
                  onResultSelect={focusTextInput}
                  onSearchChange={handleSearchChange}
                  resultRenderer={searchResultsRenderer}
                  results={results}
                  value={value}
                />
              </Menu.Item>
              <Menu.Item>
                <Header inverted as="h5">
                  Squid version{' '}
                  <Dropdown
                    options={versionDropdownOptions()}
                    inline
                    defaultValue={version}
                    onChange={handleVersionDropdownClick}
                  />
                </Header>
              </Menu.Item>
              <Menu.Item as="a" onClick={handleConfigPreview}>
                <Header inverted as="h5">
                  <Icon name="magic"/>
                  Show
                </Header>
              </Menu.Item>
              <Menu.Item as="a" onClick={handleImportWindow}>
                <Header inverted as="h5">
                  <Icon name="download"/>
                  Import
                </Header>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
        <Divider/>
        <Grid centered columns={3}>
          <Grid.Column widescreen={4} computer={2}>
            {statusMessageBox()}
          </Grid.Column>
          <Grid.Column widescreen={6} computer={7}>
            <div ref={handleContextRef}>
              <Container>
                <Accordion styled fluid>
                  {createAccordionSections()}
                </Accordion>
              </Container>
            </div>
          </Grid.Column>
          <Grid.Column widescreen={6} computer={7}>
            <Sticky context={elemContextRef}>
              <Segment basic size="small">
                <p/>
                <Header>{helpTitle}</Header>
                <pre>{helpContent}</pre>
              </Segment>
            </Sticky>
          </Grid.Column>
        </Grid>
        {modalWindowRenderer(
          openWindow,
          'copy',
          'New configuration',
          <>
            <Modal.Content scrolling>
              <Form>
                <Form.Field>
                  <p>
                    <b>To use:</b> copy configuration from the text area below
                    and save it as squid.conf in the location of the original
                    configuration file. By default, this file is located at{' '}
                    <b>/etc/squid/squid.conf</b> or{' '}
                    <b>/usr/local/squid/etc/squid.conf</b>.
                  </p>
                  <TextArea rows={20} value={generateSquidConfiguration()}/>
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button negative size="large" onClick={closeDialogWindow}>
                close
              </Button>
            </Modal.Actions>
          </>,
        )}
        {modalWindowRenderer(
          openEditor,
          'edit',
          dataJSON.tags[multilineEntryId],
          <>
            <Modal.Content scrolling>
              <Form>
                <Form.Field>
                  <TextArea
                    rows={20}
                    defaultValue={dataJSON.value[multilineEntryId]}
                    onChange={handleMultilineEdit}
                  />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button type="reset" secondary>
                Revert to default
              </Button>
              <Button secondary onClick={displayMultilineEditor}>
                Save and close
              </Button>
            </Modal.Actions>
          </>,
        )}
        {modalWindowRenderer(
          openImportWindow,
          'paste',
          'Import existing configuration',
          <>
            <Modal.Content scrolling>
              <p>
                <b>To import:</b> copy and paste contents of <b>squid.conf</b>{' '}
                into the window below. By default, this file is located at{' '}
                <b>/etc/squid/squid.conf</b> or{' '}
                <b>/usr/local/squid/etc/squid.conf</b>.
              </p>
              <p>
                <b>Please note:</b> lines that begin with &apos;#&apos; (i.e.
                commented out) are not going to be processed.
              </p>
              <Form>
                <Form.TextArea
                  control="textarea"
                  onChange={readConfigurationToImport}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button secondary onClick={handleImportWindow}>
                Close
              </Button>
              <Button
                secondary
                type="submit"
                method="post"
                onClick={importConfiguration}
              >
                Import
              </Button>
            </Modal.Actions>
          </>,
        )}
        <Dimmer
          inverted
          active={aboutScreenActive}
          onClickOutside={handleAboutWindow}
          page
        >
          <Header as="h1" color={primaryAccentColor}>
            <Icon name="circle outline" color={primaryAccentColor}/>
            Sucker
          </Header>
          <Header as="h2" color={greyColor}>
            version {suckerVersionString}
          </Header>
          <Header color={greyColor}>
            <p>
              configuration editor for{' '}
              <a href="http://www.squid-cache.org/">Squid</a> caching proxy
            </p>
            <p>
              <Icon name="github"/>
              Github:{' '}
              <a href="https://github.com/itworks99/sucker">itworks99/sucker</a>
            </p>
            <p>Built with Bottle, Gunicorn, Python, React and Semantic-UI</p>
            <p>
              Created in Sydney with <Icon color="pink" name="heart"/>
            </p>
          </Header>
        </Dimmer>
        {modalWindowRenderer(
          openReloadConfirmation,
          'question',
          'Confirm reload of the Squid base configuration file',
          <>
            <Modal.Content>
              This action will reload base configuration file with the version
              requested. Please note that any unsaved changes are going to be
              lost. Do you want to proceed?
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={closeReloadConfirmationWindow}>
                no
              </Button>
              <Button positive>yes</Button>
            </Modal.Actions>
          </>,
        )}
      </>
    );
  }
  return output;
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
