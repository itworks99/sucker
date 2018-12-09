import React, { Component } from 'react';
import { Accordion, Button, Checkbox, Container, Dimmer, Divider, Form, Grid, Header, Icon, Input, Menu, Message, Modal, Segment, SegmentGroup, Sidebar, TextArea } from 'semantic-ui-react';
import * as data from './config.json';

export default class Sucker extends Component {

  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.state = { visible: false };
    this.state = { helpId: 0 };

    this.handleClick = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex })
    }

    this.handleShowClick = (e) => {
      this.state.helpId = e.target.id;
      this.setState({ visible: true });
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleConfigPreview = this.handleConfigPreview.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);

  }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
  }
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


    const primaryAccentColor = "purple";
    const sslOptionsSection = 'SSL OPTIONS';

    var squidVersion = data.version[0]

    function insertSections() {
      var objectsToOutput = []
      var sectionIndex, n = 0;
      var entryKey = 0;

      for (var i = 0; i < data.allsections.length; i++) {
        sectionIndex = ((i + 1) * 10000);

        var sectionContent = []
        var defaultChecked = '';
        var anyEntriesEnabled = 0;
        var dropDownIconColor = 'default'

        while (data.sections[n] === i) {

          var inputForm = (<div />);

          if (data.isenabled[n] == true) {
            defaultChecked = (<Checkbox defaultChecked slider />)
            anyEntriesEnabled = anyEntriesEnabled + 1;
          } else {
            defaultChecked = (<Checkbox slider />)
          }

          if (data.switchable[n] == 0) {
            inputForm = (
              <Input size='small' fluid defaultValue={data.value[n]} />)
          } else {
            inputForm = (
              <Checkbox slider />
            )
          }


          sectionContent[n] = (
            <Grid.Row textAlign='left' verticalAlign='middle' columns={4} dense>
              <Grid.Column width={1}>
                {defaultChecked}
              </Grid.Column>
              <Grid.Column width={4}>
                {data.entry[n]}
              </Grid.Column>
              <Grid.Column width={8}>
                {inputForm}
              </Grid.Column>
              <Grid.Column width={1}>
                <Button id={entryKey++} inverted toggle icon='help' compact size='mini' color={primaryAccentColor} active={active} onClick={handleShowClick} />
              </Grid.Column>
            </Grid.Row >
          );
          n++;

          if (anyEntriesEnabled > 0) {
            dropDownIconColor = primaryAccentColor;
          } else {
            dropDownIconColor = 'grey'
          }

          if (data.allsections[i] === sslOptionsSection) {
            var sslSectionMessage = (
              <Message icon compact>
                <Icon name='warning sign' color={primaryAccentColor} />
                <Message.Content>
                  <Message.Header>Warning</Message.Header>
                  Those options are only available if Squid is rebuilt with the --with-openssl
                </Message.Content>
              </Message>
            )
          } else { sslSectionMessage = (<div />) }

          objectsToOutput[i] = (
            <Container>
              <Accordion.Title active={activeIndex === sectionIndex} index={sectionIndex} key={sectionIndex} onClick={handleClick}>
                <Icon name='dropdown' />
                <Icon name='bookmark' color={dropDownIconColor} />
                {data.allsections[i]}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === sectionIndex}>
                {sslSectionMessage}
                <Grid>
                  {sectionContent}
                </Grid>
              </Accordion.Content>
            </Container>
          );
        }
      }
      return (objectsToOutput);
    }

    function generateSquidConfiguration() {
      var generatedSquidConfiguration = '';
      for (var i = 0; i < data.isenabled.length; i++) {
        if (data.isenabled[i] == true) generatedSquidConfiguration = (generatedSquidConfiguration + '\n' + data.value[i]);
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
              <Header>{data.entry[this.state.helpId]}</Header>
              <Divider />
              <Container text textAlign='justified'>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column width={10}>
                      {data.help[this.state.helpId]}
                    </Grid.Column>
                    <Grid.Column />
                  </Grid.Row>
                </Grid>
              </Container>
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <SegmentGroup>
              <Segment top attached>
                <Menu fixed='top' inverted fitted='vertically'>
                  <Container>
                    <Menu.Item as='a' header onClick={this.handleOpen}>
                      <Header as='h3' inverted>
                        <Icon inverted name='circle outline' size='big' />
                        <Header.Content>
                          Sucker
                        <Header.Subheader>Configuration editor for Squid</Header.Subheader>
                        </Header.Content>
                      </Header>
                    </Menu.Item>
                    <Menu.Item as='a'>
                      <Header as='h5' inverted>Base config version
                        <Header.Subheader>{squidVersion}</Header.Subheader>
                      </Header>
                    </Menu.Item>
                    <Menu.Item as='a'><Icon name="file code" size='large' onClick={this.handleConfigPreview} /></Menu.Item>
                    <Menu.Item as='a'><Icon name="recycle" size='large' /></Menu.Item>
                  </Container>
                </Menu>
              </Segment>
              <Divider />
              <Segment vertical>
                <Container>
                  <Accordion fluid styled>
                    {insertSections()}
                  </Accordion>
                </Container>
              </Segment>
            </SegmentGroup>
          </Sidebar.Pusher>
        </Sidebar.Pushable>



        <Dimmer inverted active={active} onClickOutside={this.handleClose} page>
          <Header size='huge' icon color={primaryAccentColor}>
            <Icon name='circle outline' color={primaryAccentColor} />
            Sucker
            <Header.Subheader>a configuration editor for Squid</Header.Subheader>
            <Header.Subheader>ver.0.1 (deep beta)</Header.Subheader>
          </Header>
          <Header size='small' color='grey'>Built with Flask, Python, React and Semantic-UI</Header>
          <Header size='small' color='grey'>Created in Sydney with </Header>
          <Icon color='pink' size='big' name='heart' />
        </Dimmer>



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
              <TextArea autoHeight>
                {generateSquidConfiguration()}
              </TextArea>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative size='large' onClick={this.close}>
              close
            </Button>
          </Modal.Actions>
        </Modal>
      </div >
    )
  }
}
