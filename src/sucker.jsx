import _ from "lodash";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Container,
  Dimmer,
  Divider,
  Dropdown,
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
  Segment,
  Sticky,
  Table,
  TextArea,
} from "semantic-ui-react";

const suckerVersionString = "0.3";

export default function Sucker() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(1);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [helpEntryId, setHelpEntryId] = useState(0);
  const [openEditor, setOpenEditor] = useState(false);
  const [openImportWindow, setOpenImportWindow] = useState(false);
  const [dataJSON, setDataJSON] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [version, setVersion] = useState("");
  const [openReloadConfirmation, setOpenReloadConfirmation] = useState(false);
  const [openWindow, setOpenWindow] = useState(false);
  const [elemContextRef, setContextRef] = useState();
  const [aboutScreenActive, setAboutScreenActive] = useState();
  const [configurationToImport, setConfigurationToImport] = useState();
  const [multilineEntryId, setMultilineEntryId] = useState();
  const [err, setError] = useState();

  const componentRef = [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const source = [];

  function handleImportWindow() {
    setOpenImportWindow(!openImportWindow);
  }

  function handleMultilineEdit(e) {
    dataJSON.value[multilineEntryId] = e.target.value;
  }

  function handleVersionDropdownClick(e) {
    const ver = e.target.innerText;
    setVersion(ver);
    setOpenReloadConfirmation(true);
  }

  function handleEntrySliderClick(e) {
    dataJSON.is_enabled[e.target.value] = !dataJSON.is_enabled[e.target.value];
  }

  function handleHelpButtonClick(e, value) {
    setHelpEntryId(value.value);
  }

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    setActiveAccordionIndex(newIndex);
  };

  function handleConfigPreview() {
    setOpenWindow(true);
  }

  function handleAboutWindow() {
    setAboutScreenActive(!aboutScreenActive);
  }

  function handleContextRef(contextRef) {
    setContextRef(contextRef);
  }

  useEffect(() => {
    function loadConfigurationFile(httpRequestMethod, fetchUrl) {
      let body;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Request-Headers":
          "X-Requested-With, Content-Type, Accept, access-control-allow-headers, X-CSRF-Token, access-control-allow-methods, access-control-allow-origin",
      };
      if (fetchUrl.endsWith("version")) {
        body = JSON.stringify({ version });
      }
      fetch(fetchUrl, {
        method: httpRequestMethod,
        headers,
        body,
      })
        .then((response) => response.json())
        .then((json) => {
          setDataJSON(json);
        })
        .then(setIsLoaded(true), (error) => {
          setError(error);
        });
      return setOpenReloadConfirmation(false);
    }

    if (version === "") {
      loadConfigurationFile("GET", "http://localhost:3000/json");
    } else {
      loadConfigurationFile("OPTIONS", "http://localhost:3000/version");
    }

    return function cleanup() {
      setIsLoaded(false);
    };
  }, [version]);

  function importConfiguration() {
    fetch("http://localhost:3000/import", {
      method: "POST",
      body: configurationToImport,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers":
          "X-Requested-With, Content-Type, Accept",
      },
    })
      .then(setIsLoaded(false))
      .then((response) => response.json())
      .then((json) => {
        let message = "";
        let messageList = "";
        let counter = 0;
        let z = 0;
        for (z = 0; z < json.id.length; z += 1) {
          dataJSON.is_enabled[z] = 0;
        }
        for (z = 0; z < json.id.length; z += 1) {
          const position = json.id[z];
          if (json.id[z] === 999) {
            messageList = `${messageList} ${json.tags[z]};`;
          } else {
            dataJSON.is_enabled[position] = 1;
            dataJSON.value[position] = json.value[z];
            dataJSON.switchable[position] = json.switchable[z];
            dataJSON.switch_position[position] = json.switch_position[z];
            counter += 1;
          }
        }
        if (messageList !== "") {
          messageList = ` The following entries were skipped as they are not being present in current version:${messageList}`;
        }
        message = `Import completed: ${json.id.length} entries processed, ${counter} recognized.${messageList}`;
        setOpenImportWindow(false);
        setStatusMessage(message);
        setIsLoaded(true);
      });
  }

  function closeDialogWindow() {
    setOpenWindow(false);
  }

  function readValueFromComponent(e, { entrynumber, value }) {
    dataJSON.value[entrynumber] = value;
  }

  function readConfigurationToImport(e) {
    setConfigurationToImport(e.target.value);
  }

  function displayMultilineEditor(e) {
    setMultilineEntryId(e.target.value);
    setOpenEditor(!openEditor);
  }

  function closeReloadConfirmationWindow() {
    setOpenReloadConfirmation(false);
  }

  function focusOnComponent(e, { entrynumber }) {
    const component = componentRef[entrynumber];
    component.current.focus();
  }

  function focusTextInput(props, { result }) {
    const recordNumber = result.record;
    let component = "";
    setActiveAccordionIndex(dataJSON.section_number[recordNumber]);
    setActiveRowIndex(recordNumber);
    if (dataJSON.switchable[recordNumber] !== 1) {
      component = componentRef[recordNumber];
      component.current.focus();
    }
  }

  const greyColor = "grey";
  const primaryAccentColor = "purple";
  const pinkColor = "pink";
  const blueColor = "blue";

  const searchResultsRenderer = ({ title, record }) => {
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

  const initialSearchState = {
    loading: false,
    results: [],
    value: "",
  };

  function SearchReducer(state, action) {
    switch (action.type) {
      case "CLEAN_QUERY":
        return initialSearchState;
      case "START_SEARCH":
        return { ...state, loading: true, value: action.query };
      case "FINISH_SEARCH":
        return { ...state, loading: false, results: action.results };

      default:
        throw new Error();
    }
  }

  const modalWindowRenderer = (onOpen, icon, HeaderContent, modalcontent) => {
    return (
      <Modal
        dimmer="inverted"
        open={onOpen}
        closeOnEscape
        onClose={closeDialogWindow}
      >
        <Modal.Header>
          <Icon name={icon} />
          <>{HeaderContent}</>
        </Modal.Header>
        {modalcontent}
      </Modal>
    );
  };

  const statusMessageBox = () => {
    return (
      <Message color={greyColor}>
        <p>
          Loaded configuration for Squid ver. <b>{version}</b>
        </p>
        <p>
          <b>{dataJSON.tags.length}</b> unique tags in{" "}
          <b>{dataJSON.all_sections.length}</b> sections
        </p>
        <p>{statusMessage}</p>
        <p>Legend:</p>
        <p>
          <Icon name="tags" /> - selected section
        </p>
        <p>
          <Icon name="tags" color={greyColor} /> - section without enabled
          options
        </p>
        <p>
          <Icon name="tags" color={primaryAccentColor} /> - section with enabled
          options
        </p>
      </Message>
    );
  };

  function versionDropdownOptions() {
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
    const AccordionContent = [];
    function getOptions(keys, tag) {
      return Array.from(keys, (key) => ({
        key: `${tag} ${key}`,
        text: `${tag} ${key}`,
        value: `${tag} ${key}`,
      }));
    }
    if (dataJSON) {
      let n = 0;
      let tagEntryKey = 0;
      let warningBuiltWithHover = "";
      let warningMessageHover = "";
      let tagComponentUnitLabel = "";
      const AccordionIconColors = [];

      for (let i = 0; i < dataJSON.all_sections.length; i += 1) {
        const SectionContentsPopup = [];
        const TableContentInSection = [];
        SectionContentsPopup[i] = "";

        while (dataJSON.section_number[n] === i) {
          if (dataJSON.is_enabled[n] > 0) {
            AccordionIconColors[i] = primaryAccentColor;
          }

          let tagRepresentationComponent = "";
          SectionContentsPopup[i] += `${dataJSON.tags[n]}\n`;

          componentRef[n] = React.createRef();
          const reference = componentRef[n];

          if (!dataJSON.switchable[n]) {
            if (dataJSON.units[n]) {
              tagComponentUnitLabel = (
                <>
                  <Label basic content={dataJSON.units[n]} horizontal />
                </>
              );
            } else {
              tagComponentUnitLabel = "";
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
                      <input />
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
            const options = getOptions(["on", "off"], tag);
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

          warningBuiltWithHover = "";

          if (dataJSON.message_built[n]) {
            warningBuiltWithHover = (
              <>
                <Popup
                  trigger={<Icon color={blueColor} name="warning sign" />}
                  content={`Only available if Squid is compiled with the ${dataJSON.message_built[n]}`}
                />
              </>
            );
          }

          warningMessageHover = "";

          if (dataJSON.message_warning[n]) {
            warningMessageHover = (
              <>
                <Popup
                  trigger={<Icon color={pinkColor} name="warning sign" />}
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
              <Table.Cell width={1} align="left">
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
                  trigger={<Icon name="dropdown" />}
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
              <Icon name="tags" color={AccordionIconColors[i]} />
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
    let generatedSquidConfiguration = "";
    for (let i = 0; i < dataJSON.section_number.length; i += 1) {
      if (dataJSON.is_enabled[i])
        generatedSquidConfiguration = `${generatedSquidConfiguration}\n${dataJSON.value[i]}`;
    }
    return generatedSquidConfiguration;
  }

  // Handle search box
  const [state, dispatch] = React.useReducer(SearchReducer, initialSearchState);
  const { loading, results, value } = state;

  const timeoutRef = React.useRef();
  const handleSearchChange = React.useCallback(
    (e, data) => {
      clearTimeout(timeoutRef.current);
      dispatch({ type: "START_SEARCH", query: data.value });

      timeoutRef.current = setTimeout(() => {
        if (data.value.length < 1) {
          dispatch({ type: "CLEAN_QUERY" });
          return;
        }
        const re = new RegExp(_.escapeRegExp(data.value), "i");
        const isMatch = (result) => re.test(result.title);
        const res = _.filter(source, isMatch);
        dispatch({
          type: "FINISH_SEARCH",
          results: res,
        });
      }, 300);
    },
    [source]
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  React.useEffect(() => {}, [helpEntryId]);

  if (err) {
    return <div>Error: {err.message}</div>;
  }

  let output = "";

  if (isLoaded === false || dataJSON.tags === undefined) {
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
    if (version === "") {
      setVersion(dataJSON.squid_version[0]);
    }
    dataJSON.tags.forEach((tag, id) =>
      source.push({
        title: `${tag}`,
        record: id,
      })
    );
    const helpTitle = dataJSON.tags[helpEntryId - 1];
    const helpContent = dataJSON.help[helpEntryId - 1];

    output = (
      <>
        <Segment>
          <Menu fixed="top" inverted fitted="vertically">
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
                  Squid version{" "}
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
                  <Icon name="magic" />
                  Show
                </Header>
              </Menu.Item>
              <Menu.Item as="a" onClick={handleImportWindow}>
                <Header inverted as="h5">
                  <Icon name="download" />
                  Import
                </Header>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
        <Divider />
        <Grid centered columns={3}>
          <Grid.Column widescreen={4} computer={2}>
            {statusMessageBox()}
          </Grid.Column>
          <Grid.Column widescreen={6} computer={7}>
            <div ref={() => handleContextRef}>
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
                <p />
                <Header>{helpTitle}</Header>
                <pre>{helpContent}</pre>
              </Segment>
            </Sticky>
          </Grid.Column>
        </Grid>
        {modalWindowRenderer(
          openWindow,
          "copy",
          "New configuration",
          <>
            <Modal.Content scrolling>
              <Form>
                <Form.Field>
                  <p>
                    <b>To use:</b> copy configuration from the text area below
                    and save it as squid.conf in the location of the original
                    configuration file. By default, this file is located at{" "}
                    <b>/etc/squid/squid.conf</b> or{" "}
                    <b>/usr/local/squid/etc/squid.conf</b>.
                  </p>
                  <TextArea rows={20} value={generateSquidConfiguration()} />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button negative size="large" onClick={closeDialogWindow}>
                close
              </Button>
            </Modal.Actions>
          </>
        )}
        {modalWindowRenderer(
          openEditor,
          "edit",
          () => dataJSON.tags[multilineEntryId],
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
          </>
        )}
        {modalWindowRenderer(
          openImportWindow,
          "paste",
          "Import existing configuration",
          <>
            <Modal.Content scrolling>
              <p>
                <b>To import:</b> copy and paste contents of <b>squid.conf</b>{" "}
                into the window below. By default, this file is located at{" "}
                <b>/etc/squid/squid.conf</b> or{" "}
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
          </>
        )}
        <Dimmer
          inverted
          active={aboutScreenActive}
          onClickOutside={handleAboutWindow}
          page
        >
          <Header as="h1" color={primaryAccentColor}>
            <Icon name="circle outline" color={primaryAccentColor} />
            Sucker
          </Header>
          <Header as="h2" color={greyColor}>
            version {suckerVersionString}
          </Header>
          <Header color={greyColor}>
            <p>
              configuration editor for{" "}
              <a href="http://www.squid-cache.org/">Squid</a> caching proxy
            </p>
            <p>
              <Icon name="github" />
              Github:{" "}
              <a href="https://github.com/itworks99/sucker">itworks99/sucker</a>
            </p>
            <p>Built with Bottle, Gunicorn, Python, React and Semantic-UI</p>
            <p>
              Created in Sydney with <Icon color="pink" name="heart" />
            </p>
          </Header>
        </Dimmer>
        {modalWindowRenderer(
          openReloadConfirmation,
          "question",
          "Confirm reload of the Squid base configuration file",
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
          </>
        )}
      </>
    );
  }
  return output;
}
