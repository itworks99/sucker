import React from 'react';
import { Accordion, Button, Checkbox, Container, Dimmer, Divider, Dropdown, Form, Grid, Header, Icon, Input, Menu, Modal, Popup, Segment, Table, TextArea } from 'semantic-ui-react';
import * as data from './config.json';

var finalConfigDataToOutput = [];

class Sucker extends React.Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.state = { visible: false };
    this.state = { helpEntryId: 0 };
    // this.state = { entryId: 0 };
    this.state = { confirm: false };
    this.state = { openEditor: false };
    this.state = { setEntryEnabled: false }
    this.state = { inputFieldValue: '' }

    this.handleClick = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex })
    }

    this.handleShowHelpButtonClick = (e) => {
      this.setState({ helpEntryId: e.target.value });
      this.setState({ helpTextIsVisible: true });
    }

    this.handleEntrySliderClick = (e) => {
      if (e.target.checked) {
        if (this.inputFieldValue) {
          finalConfigDataToOutput[e.target.value] = this.inputFieldValue
        } else {
          finalConfigDataToOutput[e.target.value] = data.value[e.target.value]
        }
      } else {
        finalConfigDataToOutput[e.target.value] = ''
      }
    }

    this.revertToDefaultValue = (e) => {

    }

    this.readInputFieldValue = (e, { value }) => {
      this.inputFieldValue = value;
    }

    this.handleDropdownChange = (e, { value }) => {
      this.inputFieldValue = value;
    }

    this.handleMultilineEdit = (e) => {
      this.multilineEntryId = e.target.value;
      this.setState((props) => ({ openEditor: !props.openEditor }));
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleConfigPreview = this.handleConfigPreview.bind(this);
    this.handleMultilineEdit = this.handleMultilineEdit.bind(this);
    this.handleShowHelpButtonClick = this.handleShowHelpButtonClick.bind(this);
    this.handleEntrySliderClick = this.handleEntrySliderClick.bind(this);
    this.readInputFieldValue = this.readInputFieldValue.bind(this);
    this.revertToDefaultValue = this.revertToDefaultValue.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
  }

  confirm = () => this.setState({ confirm: true })
  confirmClose = () => this.setState({ confirm: false })
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })

  handleEditorClose = () => this.setState({ openEditor: false })
  handleConfigPreview = () => this.setState({ open: true })
  handleHideClick = () => this.setState({ visible: false })
  handleSidebarHide = () => this.setState({ visible: false })
  handleRadioChange = (e, { value }) => this.setState({ value })

  render() {
    const { activeIndex } = this.state
    const { active } = this.state
    const { openEditor, open, closeOnEscape } = this.state
    // const { visible } = this.state
    // const { setEntryEnabled } = this.state
    // const { value } = this.state
    // const { inputFieldValue } = this.state
    const handleClick = this.handleClick;
    const handleShowClick = this.handleShowHelpButtonClick;
    const handleEntrySliderClick = this.handleEntrySliderClick;
    const handleMultilineEdit = this.handleMultilineEdit;
    const readInputFieldValue = this.readInputFieldValue;
    const handleDropdownChange = this.handleDropdownChange

    const blackColor = 'black';
    const greyColor = 'grey';
    const primaryAccentColor = 'purple';

    var squidVersion = data.version[0]

    var tagInputFieldRef = this.tagInputFieldRef;

    // const tagInputFieldRef = React.createRef();

    function insertSections() {
      var objectsToOutput = []
      var sectionIndex, n = 0;
      var tagEntryKey = 0;
      var inputKey = 0;
      var entryRowKey = 0;
      var helpKey = 1000;
      var searchDropDown = "";

      for (var i = 0; i < data.allsections.length; i++) {
        sectionIndex = ((i + 1) * 10000);

        var popupSectionTagList = [];
        var sectionContent = [];
        var anyEntriesEnabled = 0;
        var dropDownIconColor = 'default'

        popupSectionTagList[i] = '';

        while (data.sections[n] === i) {

          var tagRowToInsertIntoSection = "";
          popupSectionTagList[i] += '\n\t' + data.entry[n];

          if (data.entry[n] != "") {
            if (data.isenabled[n] === 1) {

              finalConfigDataToOutput[n] = data.value[n]
              anyEntriesEnabled = anyEntriesEnabled + 1;
              var entryEnabled = true

            } else {
              entryEnabled = false
            }

            tagInputFieldRef = 'inputEntry' + inputKey++

            if (data.switchable[n] === 0) {
              // Tag with unit label
              if (data.units[n]) {
                tagRowToInsertIntoSection = (
                  <Input
                    key={tagInputFieldRef}
                    defaultValue={data.value[n]}
                    fluid
                    onChange={readInputFieldValue}
                    label={{ tag: true, content: data.units[n] }}
                    labelPosition='right'
                  />
                )
              } else {
                // Regular tag
                tagRowToInsertIntoSection = (
                  <Input
                    key={tagInputFieldRef}
                    defaultValue={data.value[n]}
                    fluid
                    onChange={readInputFieldValue}
                  />)
              }
              // Tag with on/off selection
            } else if (data.switchable[n] === 1) {
              var options = [
                { key: 'off', text: data.entry[n] + 'off', value: data.entry[n] + 'off' },
                { key: 'on', text: data.entry[n] + 'on', value: data.entry[n] + 'on' },
              ]

              tagRowToInsertIntoSection = (
                <Dropdown
                  fluid selection
                  options={options}
                  defaultValue={options[data.switchposition[n]].value}
                  onChange={handleDropdownChange}
                />)
            } else if (data.switchable[n] === 2) {
              tagRowToInsertIntoSection = (
                <Button value={n} secondary compact onClick={handleMultilineEdit}>{data.entry[n]} - Click to edit</Button>
              )
            }

            var popupMessage = ""
            var warningIcon = ""

            if (data.onlyavailableifrebuiltwith[n]) {
              popupMessage = "Only available if Squid is compiled with the " + data.onlyavailableifrebuiltwith[n]
              warningIcon = (
                <Popup trigger={
                  <Icon color={primaryAccentColor} name="warning sign" />
                } content={popupMessage} />
              )
            }

            sectionContent[n] = (
              <Table.Row key={'entryRowEntry' + entryRowKey++}>
                <Table.Cell width={1}>
                  <Checkbox value={tagEntryKey} id={'checkboxEntry' + tagEntryKey++} defaultChecked={entryEnabled} slider onClick={handleEntrySliderClick} />
                </Table.Cell>
                <Table.Cell width={1}>{warningIcon}</Table.Cell>
                <Table.Cell >
                  {tagRowToInsertIntoSection}
                </Table.Cell>
                <Table.Cell width={1} allign='left'><Button value={helpKey++} compact basic color={greyColor} active={active} onClick={handleShowClick}>Help</Button></Table.Cell>
              </Table.Row>
            );

          }
          n++;
        }

        if (anyEntriesEnabled > 0) {
          dropDownIconColor = primaryAccentColor;
        } else {
          dropDownIconColor = greyColor;
        }

        objectsToOutput[i] = (
          <Container key={'sectionEntry' + sectionIndex}>
            <Accordion.Title active={activeIndex === sectionIndex} index={sectionIndex} onClick={handleClick}>
              <Popup
                trigger={<Icon name='dropdown' color={dropDownIconColor} />}
                position='left center'
                content={popupSectionTagList[i]}
              />
              <Icon name='tags' color={dropDownIconColor} />
              &nbsp;
              {data.allsections[i]}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === sectionIndex}>
              <Table striped compact basic='very'>
                <Table.Body>
                  {sectionContent}
                </Table.Body>
              </Table>
            </Accordion.Content>
          </Container>
        );
      }
      return (objectsToOutput);
    }

    function generateSquidConfiguration() {
      var generatedSquidConfiguration = '';
      for (var i = 0; i < data.sections.length; i++) {
        if (finalConfigDataToOutput[i])
          generatedSquidConfiguration = (generatedSquidConfiguration + '\n' + finalConfigDataToOutput[i]);
      }
      return (generatedSquidConfiguration)
    }

    return (
      <div>
        <Segment>
          <Menu fixed='top' inverted fitted='vertically' color={blackColor}>
            <Container>
              <Menu.Item as='a' header onClick={this.handleOpen}>
                <Header as='h3' inverted>
                  <Icon inverted name='circle outline' size='big' />
                  <Header.Content>Sucker
                        <Header.Subheader>Configuration editor for Squid</Header.Subheader>
                  </Header.Content>
                </Header>
              </Menu.Item>
              <Menu.Item as='a'>
                <Header as='h5' inverted>Base config version
                        <Header.Subheader>{squidVersion}</Header.Subheader>
                </Header>
              </Menu.Item>
              <Menu.Item as='a'>
                <Header as='h5' inverted>Sections
                          <Header.Subheader>{(data.allsections.length)}</Header.Subheader>
                </Header>
              </Menu.Item>
              <Menu.Item as='a'>
                <Header as='h5' inverted>Entries
                        <Header.Subheader>{(data.entry.length)}</Header.Subheader>
                </Header>
              </Menu.Item>
              {/* <Menu.Item as='a'>
                Search placeholder
              </Menu.Item> */}
              <Menu.Menu position='right'>
                <Menu.Item as='a' onClick={this.handleConfigPreview}><Icon name="magic" />Show final configuration</Menu.Item>
                {/* <Menu.Item as='a'><Icon name="folder open" />Open</Menu.Item> */}
                {/* <Menu.Item as='a' onClick={this.confirm}><Icon name="trash" />Reset */}
                {/* <Confirm header='Reset current configuration to default settings' open={this.state.confirm} onCancel={this.confirmClose} onConfirm={this.confirmClose} /> */}
                {/* </Menu.Item> */}
              </Menu.Menu>
            </Container>
          </Menu>
        </Segment>
        <Divider />

        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Accordion styled fluid>
                  {insertSections()}
                </Accordion>
              </Container>
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Segment basic>
                  <Header size="medium">
                    {data.entry[this.state.helpEntryId - 1000]}
                  </Header>
                  <pre>{data.help[(this.state.helpEntryId - 1000)]}</pre>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Modal
          dimmer='inverted'
          open={open}
          closeOnEscape={closeOnEscape}
          onClose={this.close}
        >
          <Header icon='copy' content='New configuration' />
          <Modal.Content>
            <p>Just copy configuration from the text area below</p>
            <Form>
              <TextArea autoHeight value={generateSquidConfiguration()} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative size='large' onClick={this.close}>close</Button>
          </Modal.Actions>
        </Modal>

        <Modal
          dimmer='inverted'
          open={openEditor}
          closeOnEscape={closeOnEscape}
          onClose={this.close}
        >
          <Header icon='edit' content={data.entry[this.multilineEntryId]} />
          <Modal.Content scrolling>
            <Form>
              <TextArea autoHeight defaultValue={data.value[this.multilineEntryId]} onInput={readInputFieldValue} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={this.revertToDefaultValue}>Revert to default</Button>
            <Button secondary onClick={this.handleMultilineEdit}>Save and close</Button>
          </Modal.Actions>
        </Modal>

        <Dimmer inverted active={active} onClickOutside={this.handleClose} page>
          <Header as='h1' icon color={primaryAccentColor}>
            <Icon name='circle outline' color={primaryAccentColor} />Sucker
            <Header.Subheader>ver.0.1 (deep beta)</Header.Subheader>
          </Header>
          <Header color={greyColor}>
            <p>configuration editor for <a href="http://www.squid-cache.org/">Squid</a> caching proxy</p>
            <p><Icon name='github' />Github: <a href="https://github.com/itworks99/sucker">itworks99/sucker</a></p>
            <p>Built with Flask, Python, React and Semantic-UI</p>
            <p>Created in Sydney with  <Icon color='pink' name='heart' /></p>
          </Header>
        </Dimmer>
      </div >
    )
  }
}

export default Sucker;