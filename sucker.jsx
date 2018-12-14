import React, { Component } from 'react';
import { Accordion, Button, Checkbox, Confirm, Container, Dimmer, Divider, Form, Header, Icon, Input, Menu, Message, Modal, Segment, SegmentGroup, Sidebar, Table, TextArea } from 'semantic-ui-react';
import * as data from './config.json';

var dataOutput = [data.sections.length];

export default class Sucker extends Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.state = { visible: false };
    this.state = { helpId: 0 };
    this.state = { entryId: 0 };
    this.state = { confirm: false }

    this.handleClick = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex })
    }

    this.handleShowClick = (e) => {
      this.state.helpId = e.target.value;
      this.setState({ visible: true });
    }

    this.handleEntrySliderClick = (e) => {

      this.setState({
        entryId: e.target.value
      })
      if (!e.target.checked) {
        dataOutput[e.target.value] = data.value[e.target.value]
      } else {
        dataOutput[e.target.value] = ''
      }
      console.log(dataOutput)
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleConfigPreview = this.handleConfigPreview.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleEntrySliderClick = this.handleEntrySliderClick.bind(this);
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

  handleConfigPreview = () => this.setState({ open: true })
  handleHideClick = () => this.setState({ visible: false })
  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const { activeIndex } = this.state
    const { active } = this.state
    const { open, closeOnEscape, closeOnDimmerClick } = this.state
    const { visible } = this.state
    const handleClick = this.handleClick;
    const handleHideClick = this.handleHideClick;
    const handleShowClick = this.handleShowClick;
    const handleSidebarHide = this.handleSidebarHide;
    const handleEntrySliderClick = this.handleEntrySliderClick;

    const topMenuColor = 'black';
    const primaryAccentColor = 'purple';
    const sslOptionsSection = 'SSL OPTIONS';
    var squidVersion = data.version[0]

    function insertSections() {
      var objectsToOutput = []
      var sectionIndex, n = 0;
      var entryKey = 0;
      var inputKey = 0;
      var entryRowKey = 0;
      var helpKey = 1000;

      for (var i = 0; i < data.allsections.length; i++) {
        sectionIndex = ((i + 1) * 10000);

        var sectionContent = []
        var defaultChecked = '';
        var anyEntriesEnabled = 0;
        var dropDownIconColor = 'default'

        while (data.sections[n] === i) {

          var inputForm = (<div />);

          if (data.isenabled[n] === 1) {

            dataOutput[n] = data.value[n]

            anyEntriesEnabled = anyEntriesEnabled + 1;
            var entryEnabled = true
          } else {
            entryEnabled = false
          }

          defaultChecked = (<Checkbox value={entryKey} id={'checkboxEntry' + entryKey++} defaultChecked={entryEnabled} slider onClick={handleEntrySliderClick} />);

          if (data.switchable[n] === 0) {
            inputForm = (
              <Input size='small' id={'inputEntry' + inputKey++} disabled={entryEnabled = !entryEnabled} fluid value={data.value[n]} />)
          } else {
            if (data.switchable[n] === 1) {
              if (data.switchposition[n] === 1) {
                var checkedState = true;
              } else {
                checkedState = false;
              }
              inputForm = (<Checkbox slider defaultChecked={checkedState} label="on/off" />)
            }
          }

          sectionContent[n] = (
            //            <Grid.Row key={'gridRowEntry' + gridRowKey++} textAlign='left' verticalAlign='middle' columns={7}>
            <Table.Row key={'entryRowEntry' + entryRowKey++}>
              <Table.Cell>{defaultChecked}</Table.Cell>
              <Table.Cell width={4}>{data.entry[n]}</Table.Cell>
              <Table.Cell width={6}> {inputForm}</Table.Cell>
              <Table.Cell textAlign='center'><Button icon='delete' basic compact /></Table.Cell>
              <Table.Cell><Button value={helpKey++} icon='info' basic compact active={active} onClick={handleShowClick} /></Table.Cell>
            </Table.Row>
          );
          n++;
        }

        if (anyEntriesEnabled > 0) {
          dropDownIconColor = primaryAccentColor;
        } else {
          dropDownIconColor = 'grey'
        }

        if (data.allsections[i] === sslOptionsSection) {
          var sslSectionMessage = (
            <Message color={primaryAccentColor}>Those options are only available if Squid is rebuilt with the --with-openssl</Message>
          )
        } else { sslSectionMessage = (<div />) }

        objectsToOutput[i] = (
          <Container key={'sectionEntry' + sectionIndex}>
            <Accordion.Title active={activeIndex === sectionIndex} index={sectionIndex} onClick={handleClick}>
              <Icon name='dropdown' />
              <Icon name='bookmark' color={dropDownIconColor} />
              {data.allsections[i]}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === sectionIndex}>
              {sslSectionMessage}
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
      for (var i = 0; i < dataOutput.length; i++) {
        if (dataOutput[i]) generatedSquidConfiguration = (generatedSquidConfiguration + '\n' + dataOutput[i]);
      }
      return (generatedSquidConfiguration)
    }

    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            direction='right'
            onHide={handleSidebarHide}
            vertical
            visible={visible}
            width='very wide'
          >
            <Menu.Item>
              <Table basic='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell> <Icon name='info' />{data.entry[this.state.helpId - 1000]}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{data.help[(this.state.helpId - 1000)]}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <SegmentGroup>
              <Segment>
                <Menu fixed='top' inverted fitted='vertically' color={topMenuColor}>
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
                    <Menu.Menu position='right'>
                      <Menu.Item as='a'><Icon name="magic" size='large' onClick={this.handleConfigPreview} />Show</Menu.Item>
                      <Menu.Item as='a'><Icon name="folder open" size='large' />Open</Menu.Item>
                      <Menu.Item as='a'><Icon name="trash" size='large' onClick={this.confirm} />Reset
                         <Confirm header='Reset current configuration to default settings' open={this.state.confirm} onCancel={this.confirmClose} onConfirm={this.confirmClose} />
                      </Menu.Item>
                    </Menu.Menu>
                  </Container>
                </Menu>
              </Segment>
              <Divider />
              <Segment vertical>
                <Container>
                  <Accordion styled fluid>
                    {insertSections()}
                  </Accordion>
                </Container>
              </Segment>
            </SegmentGroup>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

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

        <Dimmer inverted active={active} onClickOutside={this.handleClose} page>
          <Header as='h1' icon color={primaryAccentColor}>
            <Icon name='circle outline' color={primaryAccentColor} />Sucker
            <Header.Subheader>ver.0.1 (deep beta)</Header.Subheader>
          </Header>
          <Header color='grey'>
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
