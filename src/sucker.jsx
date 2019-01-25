import _ from "lodash";
import React from "react";
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
  Modal,
  Popup,
  Search,
  Segment,
  Sticky,
  Table,
  TextArea
} from "semantic-ui-react";
// import * as data from "./config.json";

const suckerVersionString = "ver.0.1 (deep beta)";

class Sucker extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.state = { activeRowIndex: 0 };
    this.state = { visible: false };
    this.state = { helpEntryId: 0 };
    this.state = { confirm: false };
    this.state = { openEditor: false };
    this.state = { setEntryEnabled: false };
    this.state = { openImportWindow: false };
    this.state = { dataJSON: "" };
    this.state = { isLoaded: false };
    this.state = { configurationToImport: "" };

    this.handleClick = this.handleClick.bind(this);
    this.handleConfigPreview = this.handleConfigPreview.bind(this);
    this.handleMultilineEdit = this.handleMultilineEdit.bind(this);
    this.handleHelpButtonClick = this.handleHelpButtonClick.bind(this);
    this.handleEntrySliderClick = this.handleEntrySliderClick.bind(this);
    this.readValueFromComponent = this.readValueFromComponent.bind(this);
    this.displayMultilineEditor = this.displayMultilineEditor.bind(this);
    this.handleImportWindow = this.handleImportWindow.bind(this);
    this.readConfigurationToImport = this.readConfigurationToImport.bind(this);
    this.textInputRef = {};
    this.AccordeonIconColors = {};
  }

  componentDidMount() {
    fetch("http://localhost:8080/json")
      .then(response => response.json())
      .then(
        json => {
          this.setState({
            dataJSON: json,
            isLoaded: true
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true });
  };

  confirm = () => this.setState({ confirm: true });
  confirmClose = () => this.setState({ confirm: false });
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  handleContextRef = contextRef => this.setState({ contextRef });

  handleOpen = () => this.setState({ active: true });
  handleClose = () => this.setState({ active: false });

  handleEditorClose = () => this.setState({ openEditor: false });
  handleConfigPreview = () => this.setState({ open: true });
  handleHideClick = () => this.setState({ visible: false });

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleClick = (_e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
    this.setState({ helpEntryId: 0 });
  };

  handleHelpButtonClick = e => {
    this.setState({ helpEntryId: e.target.value });
    this.setState({ helpTextIsVisible: true });
  };

  handleEntrySliderClick = e => {
    const { dataJSON } = this.state;
    if (e.target.checked) {
      dataJSON.is_enabled[e.target.value] = !dataJSON.is_enabled[
        e.target.value
      ];
    } else {
      dataJSON.is_enabled[e.target.value] = "";
    }
  };

  readValueFromComponent = (_e, { entrynumber, value }) => {
    const { dataJSON } = this.state;
    dataJSON.value[entrynumber] = value;
  };

  readConfigurationToImport = e => {
    this.configurationToImport = e.target.value;
  };

  handleMultilineEdit = e => {
    const { dataJSON } = this.state;
    dataJSON.value[this.multilineEntryId] = e.target.value;
  };

  displayMultilineEditor = (_e, { value }) => {
    this.multilineEntryId = value;
    this.setState(props => ({ openEditor: !props.openEditor }));
  };

  handleImportWindow = () => {
    this.setState({ openImportWindow: !this.state.openImportWindow });
  };

  focusTextInput = (_props, { result }) => {
    const { dataJSON } = this.state;
    var recordNumber = result.record;
    this.setState(() => ({
      activeIndex: dataJSON.section_number[recordNumber]
    }));
    this.setState(() => ({ activeRowIndex: recordNumber }));
    // this.textInputRef[result.record].focus();
  };

  importConfiguration = e => {
    fetch("http://localhost:8080/import", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this.configurationToImport)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
      });
  };

  warningIconPopup(color, content) {
    var warningMessageIcon = (
      <Popup
        trigger={<Icon color={color} name="warning sign" />}
        content={content}
      />
    );
    return warningMessageIcon;
  }

  handleSearchChange = (_e, { value }) => {
    function searchIterateOverArray() {
      var i = 1;
      return (i = i + 1);
    }
    const { dataJSON } = this.state;
    const source = _.times(
      dataJSON.tags.length,
      (i = searchIterateOverArray) => ({
        title: this.state.dataJSON.tags[i],
        record: i
      })
    );

    this.setState({ isLoading: true, value });
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title);
      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  render() {
    const {
      activeIndex: activeAccordeonIndex,
      activeRowIndex,
      active,
      openEditor: openMultilineEntryEditor,
      open: openConfigPreview,
      openImportWindow,
      closeOnEscape,
      dataJSON,
      isLoaded,
      error,
      contextRef,
      isLoading,
      value,
      results,
      configurationToImport
    } = this.state;
    const handleClick = this.handleClick;
    const handleShowHelpClick = this.handleHelpButtonClick;
    const handleEntrySliderClick = this.handleEntrySliderClick;
    const readValueFromComponent = this.readValueFromComponent;
    const displayMultilineEditor = this.displayMultilineEditor;
    const textInputRef = this.textInputRef;
    const warningIconPopup = this.warningIconPopup;

    const blackColor = "black";
    const greyColor = "grey";
    const primaryAccentColor = "purple";
    const pinkColor = "pink";

    // console.log(this.state.dataJSON.tags);

    const searchResultsRenderer = ({ title, record }) => {
      return (
        <Header
          key={record}
          size="tiny"
          content={title}
          subheader={dataJSON.all_sections[
            dataJSON.section_number[record]
          ].toLowerCase()}
        />
      );
    };

    const searchFieldRenderer = () => {
      return (
        <Search
          placeholder="Search tags"
          minCharacters={3}
          loading={isLoading}
          onResultSelect={this.focusTextInput}
          onSearchChange={this.handleSearchChange}
          resultRenderer={searchResultsRenderer}
          results={results}
          value={value}
          {...this.props}
        />
      );
    };

    const modalWindowRenderer = (onOpen, icon, headercontent, modalcontent) => {
      return (
        <Modal
          dimmer="inverted"
          open={onOpen}
          closeOnEscape={this.closeOnEscape}
          onClose={this.close}
        >
          <Header icon={icon} content={headercontent} />
          <Modal.Content scrolling>
            <Form>{modalcontent}</Form>
          </Modal.Content>
        </Modal>
      );
    };

    function createSections() {
      var AccordionContent = [];
      var n = 0;
      var tagEntryKey = 0;
      var helpKey = 1000;
      var warningBuiltWithHover = "";
      var warningMessageHover = "";
      var tagComponentUnitLabel = "";
      var AccordeonIconColors = [];

      for (var i = 0; i < dataJSON.all_sections.length; i++) {
        var SectionContentsPopup = [];
        var TableContentInSection = [];

        SectionContentsPopup[i] = "";

        while (dataJSON.section_number[n] === i) {
          if (dataJSON.is_enabled[n] > 0) {
            AccordeonIconColors[i] = primaryAccentColor;
          }

          var tagRepresentationComponent = "";
          SectionContentsPopup[i] += dataJSON.tags[n] + "\n";

          if (!dataJSON.switchable[n]) {
            if (dataJSON.units[n]) {
              tagComponentUnitLabel = (
                <Label basic content={dataJSON.units[n]} horizontal />
              );
            } else {
              tagComponentUnitLabel = "";
            }
            // Regular tag
            tagRepresentationComponent = (
              <Form.Field>
                <Input
                  fluid
                  ref={(textInputRef[n] = React.createRef())}
                  entrynumber={tagEntryKey}
                  defaultValue={dataJSON.value[n] + " "}
                  onChange={readValueFromComponent}
                  labelPosition="right"
                  type="text"
                  action
                >
                  <input />
                  {tagComponentUnitLabel}
                  <Button basic type="reset">
                    Reset
                  </Button>
                </Input>
              </Form.Field>
            );
            // Tag with on/off selection
          } else if (dataJSON.switchable[n] === 1) {
            var options = [
              {
                key: "off",
                text: dataJSON.tags[n] + " off",
                value: dataJSON.tags[n] + " off"
              },
              {
                key: "on",
                text: dataJSON.tags[n] + " on",
                value: dataJSON.tags[n] + " on"
              }
            ];

            tagRepresentationComponent = (
              <Dropdown
                ref={(textInputRef[n] = React.createRef())}
                entrynumber={tagEntryKey}
                fluid
                selection
                options={options}
                defaultValue={options[dataJSON.switch_position[n]].value}
                onChange={readValueFromComponent}
              />
            );
          } else if (dataJSON.switchable[n] === 2) {
            tagRepresentationComponent = (
              <Button
                secondary
                compact
                value={n}
                onClick={displayMultilineEditor}
              >
                {dataJSON.tags[n]} - Click to edit
              </Button>
            );
          }

          if (dataJSON.message_built[n]) {
            warningBuiltWithHover = warningIconPopup(
              primaryAccentColor,
              "Only available if Squid is compiled with the " +
                dataJSON.message_built[n]
            );
          } else {
            warningBuiltWithHover = "";
          }

          if (dataJSON.message_warning[n]) {
            warningMessageHover = warningIconPopup(
              pinkColor,
              dataJSON.message_warning[n]
            );
          } else {
            warningMessageHover = "";
          }

          TableContentInSection[n] = (
            <Table.Row key={"tableKey" + n} active={activeRowIndex === n}>
              <Table.Cell width={1}>
                <Checkbox
                  value={tagEntryKey}
                  id={"checkboxEntry" + tagEntryKey++}
                  defaultChecked={dataJSON.is_enabled[n]}
                  slider
                  onClick={handleEntrySliderClick}
                />
              </Table.Cell>
              <Table.Cell>
                <Form>{tagRepresentationComponent}</Form>
              </Table.Cell>
              <Table.Cell width={2}>
                {warningBuiltWithHover}
                {warningMessageHover}
              </Table.Cell>
              <Table.Cell width={1} allign="left">
                <Button
                  value={helpKey++}
                  compact
                  basic
                  color={greyColor}
                  active={active}
                  onClick={handleShowHelpClick}
                >
                  Help
                </Button>
              </Table.Cell>
            </Table.Row>
          );
          n++;
        }

        AccordionContent[i] = (
          <Container key={"containerKey" + i}>
            <Accordion.Title
              active={activeAccordeonIndex === i}
              index={i}
              onClick={handleClick}
            >
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
              <Icon name="tags" color={AccordeonIconColors[i]} />
              &nbsp;
              {dataJSON.all_sections[i]}
            </Accordion.Title>
            <Accordion.Content active={activeAccordeonIndex === i}>
              <Table striped compact basic="very">
                <Table.Body>{TableContentInSection}</Table.Body>
              </Table>
            </Accordion.Content>
          </Container>
        );
      }
      return AccordionContent;
    }

    function generateSquidConfiguration() {
      var generatedSquidConfiguration = "";
      for (var i = 0; i < dataJSON.section_number.length; i++) {
        if (dataJSON.is_enabled[i])
          generatedSquidConfiguration =
            generatedSquidConfiguration + "\n" + dataJSON.value[i];
      }
      return generatedSquidConfiguration;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <React.Fragment>
          <Dimmer inverted active={!isLoaded}>
            <Loader inverted size="massive">
              Loading
            </Loader>
          </Dimmer>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Segment>
            <Menu fixed="top" inverted fitted="vertically" color={blackColor}>
              <Container>
                <Menu.Item as="a" header onClick={this.handleOpen}>
                  <Header as="h3" inverted>
                    <Icon
                      inverted
                      name="circle outline"
                      color={primaryAccentColor}
                      size="big"
                    />
                    <Header.Content>
                      Sucker
                      <Header.Subheader>
                        Squid configuration editor
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Menu.Item>
                <Menu.Item as="a">{searchFieldRenderer()}</Menu.Item>
                <Menu.Item as="a">
                  <Popup
                    trigger={<Icon name="dashboard" size="large" />}
                    position="bottom left"
                  >
                    <Label.Group>
                      <Label
                        basic
                        content={dataJSON.squid_version[0]}
                        detail="Squid ver."
                      />
                      <Label
                        basic
                        content={dataJSON.all_sections.length}
                        detail="sections"
                      />
                      <Label
                        basic
                        content={dataJSON.tags.length}
                        detail="tags"
                      />
                    </Label.Group>
                  </Popup>
                </Menu.Item>
                <Menu.Item as="a" onClick={this.handleConfigPreview}>
                  <Popup
                    trigger={<Icon name="magic" size="large" />}
                    position="bottom left"
                  >
                    Show final configuration
                  </Popup>
                </Menu.Item>
                <Menu.Item as="a" onClick={this.handleImportWindow}>
                  <Popup
                    trigger={<Icon name="download" size="large" />}
                    position="bottom left"
                  >
                    Import existing configuration for editing
                  </Popup>
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
          <Divider />
          <Grid centered columns={3}>
            <Grid.Column widescreen={5} computer={2} />
            <Grid.Column widescreen={6} computer={7}>
              <div ref={this.handleContextRef}>
                <Container>
                  <Accordion styled fluid>
                    {createSections()}
                  </Accordion>
                </Container>
              </div>
            </Grid.Column>
            <Grid.Column widescreen={5} computer={7}>
              <Sticky context={contextRef} offset={75}>
                <Segment basic size="small">
                  <Header
                    content={dataJSON.tags[this.state.helpEntryId - 1000]}
                  />
                  <pre>{dataJSON.help[this.state.helpEntryId - 1000]}</pre>
                </Segment>
              </Sticky>
            </Grid.Column>
          </Grid>
          {modalWindowRenderer(
            openConfigPreview,
            "copy",
            "New configuration",
            <React.Fragment>
              <Form.Field>
                <p>
                  <b>To use:</b> copy configuration from the text area below and
                  save it as squid.conf in the location of the original
                  configuration file. By default, this file is located at{" "}
                  <b>/etc/squid/squid.conf</b> or{" "}
                  <b>/usr/local/squid/etc/squid.conf</b>.
                </p>
                <TextArea autoHeight value={generateSquidConfiguration()} />
              </Form.Field>
              <Button negative size="large" onClick={this.close}>
                close
              </Button>
            </React.Fragment>
          )}
          {modalWindowRenderer(
            openMultilineEntryEditor,
            "edit",
            dataJSON.tags[this.multilineEntryId],
            <React.Fragment>
              <Form.Field>
                <TextArea
                  autoHeight
                  defaultValue={dataJSON.value[this.multilineEntryId]}
                  onChange={this.handleMultilineEdit}
                />
              </Form.Field>
              <Button type="reset" secondary>
                Revert to default
              </Button>
              <Button secondary onClick={this.displayMultilineEditor}>
                Save and close
              </Button>
            </React.Fragment>
          )}
          {modalWindowRenderer(
            openImportWindow,
            "paste",
            "Import existing configuration",
            <React.Fragment>
              <p>
                <b>To import:</b> copy and paste contents of <b>squid.conf</b>{" "}
                into the window below. By default, this file is located at{" "}
                <b>/etc/squid/squid.conf</b> or{" "}
                <b>/usr/local/squid/etc/squid.conf</b>.
              </p>
              <Form.TextArea
                control="textarea"
                onChange={this.readConfigurationToImport}
              />
              <Button secondary onClick={this.handleImportWindow}>
                Close
              </Button>
              <Button
                secondary
                type="submit"
                method="post"
                onClick={this.importConfiguration}
              >
                Import
              </Button>
            </React.Fragment>
          )}
          <Dimmer
            inverted
            active={active}
            onClickOutside={this.handleClose}
            page
          >
            <Header as="h1" icon color={primaryAccentColor}>
              <Icon name="circle outline" color={primaryAccentColor} />
              Sucker
              <Header.Subheader>{suckerVersionString}</Header.Subheader>
            </Header>
            <Header color={greyColor}>
              <p>
                configuration editor for{" "}
                <a href="http://www.squid-cache.org/">Squid</a> caching proxy
              </p>
              <p>
                <Icon name="github" />
                Github:{" "}
                <a href="https://github.com/itworks99/sucker">
                  itworks99/sucker
                </a>
              </p>
              <p>Built with Bottle, Python, React and Semantic-UI</p>
              <p>
                Created in Sydney with <Icon color="pink" name="heart" />
              </p>
            </Header>
          </Dimmer>
        </React.Fragment>
      );
    }
  }
}

export default Sucker;
