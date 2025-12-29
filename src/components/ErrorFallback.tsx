
import {Button, Container, Divider, Icon, Message} from 'semantic-ui-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({error, resetErrorBoundary}: ErrorFallbackProps) {
  return (
    <Container style={{marginTop: '2em'}}>
      <Message negative>
        <Message.Header>
          <Icon name="warning sign" />
          Something went wrong
        </Message.Header>
        <p>An error occurred while rendering the application.</p>
        <Divider />
        <details style={{whiteSpace: 'pre-wrap'}}>
          <summary>Error details</summary>
          {error.toString()}
        </details>
        <Divider />
        <Button negative onClick={resetErrorBoundary}>
          Reload Application
        </Button>
      </Message>
    </Container>
  );
}
