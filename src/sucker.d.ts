declare module 'semantic-ui-react' {
  import * as React from 'react';

  export interface AccordionProps {
    styled?: boolean;
    fluid?: boolean;
    children?: React.ReactNode;
  }
  export const Accordion: React.FC<AccordionProps> & {
    Title: React.FC<any>;
    Content: React.FC<any>;
  };

  export const Button: React.FC<any>;
  export const Checkbox: React.FC<any>;
  export const Container: React.FC<any>;
  export const Dimmer: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Dropdown: React.FC<any>;
  export const Form: React.FC<any> & {
    Field: React.FC<any>;
    TextArea: React.FC<any>;
  };
  export const Grid: React.FC<any> & {
    Column: React.FC<any>;
  };
  export const Header: React.FC<any> & {
    Content: React.FC<any>;
    Subheader: React.FC<any>;
  };
  export const Icon: React.FC<any>;
  export const Input: React.FC<any>;
  export const Label: React.FC<any>;
  export const Loader: React.FC<any>;
  export const Menu: React.FC<any> & {
    Item: React.FC<any>;
  };
  export const Message: React.FC<any> & {
    Header: React.FC<any>;
  };
  export const Modal: React.FC<any> & {
    Header: React.FC<any>;
    Content: React.FC<any>;
    Actions: React.FC<any>;
  };
  export const Popup: React.FC<any>;
  export const Search: React.FC<any>;
  export const Segment: React.FC<any>;
  export const Sticky: React.FC<any>;
  export const Table: React.FC<any> & {
    Body: React.FC<any>;
    Cell: React.FC<any>;
    Row: React.FC<any>;
  };
  export const TextArea: React.FC<any>;
}
