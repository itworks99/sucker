import _ from 'lodash'
import React from 'react';
import { Accordion, Button, Checkbox, Container, Dimmer, Divider, Dropdown, Form, Grid, Header, Icon, Input, Label, Menu, Modal, Popup, Segment, Table, TextArea, Sticky, Search } from 'semantic-ui-react';
import * as data from './config.json';

const squidVersionString = "ver.0.1 (deep beta)"

var i = 1;
function iterateOverArray() {
  return (i = i + 1)
}
const source = _.times(data.entry.length, (i = iterateOverArray) => ({
  title: data.entry[i],
  record: i,
}))

class Sucker extends React.Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.state = { visible: false };
    this.state = { helpEntryId: 0 };
    this.state = { confirm: false };
    this.state = { openEditor: false };
    this.state = { setEntryEnabled: false }
    this.state = { inputFieldValue: '' }

    this.textInput = React.createRef();

    this.handleClick = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex })
      this.setState({ helpEntryId: 0 });
    }

    this.handleHelpButtonClick = (e) => {
      this.setState({ helpEntryId: e.target.value });
      this.setState({ helpTextIsVisible: true });
    }

    this.handleEntrySliderClick = (e) => {
      if (e.target.checked) {
        data.isenabled[e.target.value] = !data.isenabled[e.target.value]
      } else {
        data.isenabled[e.target.value] = ''
      }
    }

    this.readValueFromComponent = (e, { entrynumber, value }) => {
      data.value[entrynumber] = value
    }

    this.handleMultilineEdit = (e) => {
      data.value[this.multilineEntryId] = e.target.value
    }

    this.displayMultilineEditor = (e, { value }) => {
      this.multilineEntryId = value
      this.setState((props) => ({ openEditor: !props.openEditor }));
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleConfigPreview = this.handleConfigPreview.bind(this);
    this.handleMultilineEdit = this.handleMultilineEdit.bind(this);
    this.handleHelpButtonClick = this.handleHelpButtonClick.bind(this);
    this.handleEntrySliderClick = this.handleEntrySliderClick.bind(this);
    this.readValueFromComponent = this.readValueFromComponent.bind(this);
    this.displayMultilineEditor = this.displayMultilineEditor.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);

    this.textInput = null;

    this.setTextInputRef = (element) => {
      // console.log(e.target.value)
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };

  }

  componentWillMount() {
    this.timer = null;
    // autofocus the input on mount
    this.focusTextInput();
  }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
  }

  confirm = () => this.setState({ confirm: true })
  confirmClose = () => this.setState({ confirm: false })
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  handleContextRef = contextRef => this.setState({ contextRef })

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })

  handleEditorClose = () => this.setState({ openEditor: false })
  handleConfigPreview = () => this.setState({ open: true })
  handleHideClick = () => this.setState({ visible: false })

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
  handleResultSelect = (e, { record }) => { };
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)
      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }

  focusOnInput = (c) => {
    this.textInput.current.focus();
  }

  render() {
    const { activeIndex, active, openEditor, open, closeOnEscape } = this.state
    const { contextRef } = this.state
    const { isLoading, value, results } = this.state
    const handleClick = this.handleClick;
    const handleShowClick = this.handleHelpButtonClick;
    const handleEntrySliderClick = this.handleEntrySliderClick;
    const readValueFromComponent = this.readValueFromComponent;
    const displayMultilineEditor = this.displayMultilineEditor;
    const setTextInputRef = this.setTextInputRef;

    const blackColor = 'black';
    const greyColor = 'grey';
    const primaryAccentColor = 'purple';

    const resultRenderer = ({ title, record }) => {
      return (
        <Header
          key={record}
          size='tiny'
          content={title}
          subheader={data.allsections[data.sections[record]].toLowerCase()}
        />)
    };

    var squidVersion = data.version[0]

    function insertSections() {
      var objectsToOutput = []
      var sectionIndex, n = 0;
      var tagEntryKey = 0;
      var entryRowKey = 0;
      var helpKey = 1000;

      for (var i = 0; i < data.allsections.length; i++) {
        sectionIndex = (i + 1);

        var popupSectionTagList = [];
        var sectionContent = [];
        var anyEntriesEnabled = 0;
        var dropDownIconColor = 'default'

        popupSectionTagList[i] = '';

        while (data.sections[n] === i) {

          var tagRowToInsertIntoSection = "";
          popupSectionTagList[i] += '\n\t' + data.entry[n];

          if (data.entry[n] !== "") {
            if (data.isenabled[n] === 1) {

              anyEntriesEnabled = anyEntriesEnabled + 1;
              var entryEnabled = true

            } else {
              entryEnabled = false
            }

            if (data.switchable[n] === 0) {

              var tagLabel = ''
              // Unit label (if available)
              if (data.units[n]) {
                tagLabel = (
                  <Label basic content={data.units[n]} horizontal />)
              }
              // Regular tag
              tagRowToInsertIntoSection = (
                <Input
                  fluid
                  ref={setTextInputRef}
                  entrynumber={tagEntryKey}
                  defaultValue={data.value[n] + ' '}
                  onChange={readValueFromComponent}
                  labelPosition='right'
                  type='text'
                  action>
                  <input />
                  {tagLabel}
                  <Button basic type='reset'>Reset</Button>
                </Input>)
              // Tag with on/off selection
            } else if (data.switchable[n] === 1) {
              var options = [
                { key: 'off', text: data.entry[n] + ' off', value: data.entry[n] + ' off' },
                { key: 'on', text: data.entry[n] + ' on', value: data.entry[n] + ' on' },
              ]

              tagRowToInsertIntoSection = (
                <Dropdown
                  ref={setTextInputRef}
                  entrynumber={tagEntryKey}
                  fluid selection
                  options={options}
                  defaultValue={options[data.switchposition[n]].value}
                  onChange={readValueFromComponent}
                />)
            } else if (data.switchable[n] === 2) {
              tagRowToInsertIntoSection = (
                <Button value={n} secondary compact onClick={displayMultilineEditor}>{data.entry[n]} - Click to edit</Button>
              )
            }

            var popupMessage = ""
            var warningIcon = ""
            var warningwarningIcon = ""

            if (data.onlyavailableifrebuiltwith[n]) {
              popupMessage = "Only available if Squid is compiled with the " + data.onlyavailableifrebuiltwith[n]
              warningIcon = (
                <Popup trigger={
                  <Icon color={primaryAccentColor} name="warning sign" size="small" />
                } content={popupMessage} />
              )
            }
            if (data.warning[n]) {
              popupMessage = data.warning[n];
              warningwarningIcon = (
                <Popup trigger={
                  <Icon color='pink' name="warning sign" size="small" />
                } content={popupMessage} />
              )
            }

            sectionContent[n] = (
              <Table.Row key={'entryRowEntry' + entryRowKey++}>
                <Table.Cell width={1}>
                  <Checkbox value={tagEntryKey} id={'checkboxEntry' + tagEntryKey++} defaultChecked={entryEnabled} slider onClick={handleEntrySliderClick} />
                </Table.Cell>
                <Table.Cell width={1}>
                  {warningIcon}
                  {warningwarningIcon}
                </Table.Cell>
                <Table.Cell>
                  <Form>
                    {tagRowToInsertIntoSection}
                  </Form>
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
        if (data.isenabled[i])
          generatedSquidConfiguration = (generatedSquidConfiguration + '\n' + data.value[i]);
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
                        <Header.Subheader>Squid configuration editor</Header.Subheader>
                  </Header.Content>
                </Header>
              </Menu.Item>
              <Menu.Item as='a'>
                <Search
                  placeholder='Search tags'
                  minCharacters={3}
                  loading={isLoading}
                  onResultSelect={this.focusTextInput}
                  onSearchChange={this.handleSearchChange}
                  resultRenderer={resultRenderer}
                  results={results}
                  value={value}
                  {...this.props}
                />
              </Menu.Item>
              <Menu.Item as='a'>
                <Popup size='mini' trigger={<Icon name='chart bar'></Icon>} position='bottom left'>
                  <Label.Group>
                    <Label basic content={squidVersion} detail='Squid ver.' />
                    <Label basic content={(data.allsections.length)} detail='sections' />
                    <Label basic content={(data.entry.length)} detail='tags' />
                  </Label.Group>
                </Popup>
              </Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item as='a' onClick={this.handleConfigPreview}><Icon name="magic" />Show final configuration</Menu.Item>
              </Menu.Menu>
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
                  {insertSections()}
                </Accordion>
              </Container>
            </div>
          </Grid.Column>
          <Grid.Column widescreen={5} computer={7}>
            <Sticky context={contextRef} offset={75}>
              <Segment basic size='small'>
                <Header content={data.entry[this.state.helpEntryId - 1000]} />
                <pre>{data.help[(this.state.helpEntryId - 1000)]}</pre>
              </Segment>
            </Sticky>
          </Grid.Column>
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
              <TextArea
                autoHeight
                defaultValue={data.value[this.multilineEntryId]}
                onInput={this.handleMultilineEdit}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary >Revert to default</Button>
            <Button secondary onClick={this.displayMultilineEditor}>Save and close</Button>
          </Modal.Actions>
        </Modal>

        <Dimmer inverted active={active} onClickOutside={this.handleClose} page>
          <Header as='h1' icon color={primaryAccentColor}>
            <Icon name='circle outline' color={primaryAccentColor} />Sucker
            <Header.Subheader>{squidVersionString}</Header.Subheader>
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