
import {Dimmer, Header, Icon} from 'semantic-ui-react';

interface AboutScreenProps {
  active: boolean;
  version: string;
  onClose: () => void;
}

const COLORS = {
  grey: 'grey',
  purple: 'purple',
  pink: 'pink',
} as const;

export function AboutScreen({active, version, onClose}: AboutScreenProps) {
  return (
    <Dimmer inverted active={active} onClickOutside={onClose} page>
      <Header as="h1" color={COLORS.purple}>
        <Icon name="circle outline" color={COLORS.purple} />
        Sucker
      </Header>
      <Header as="h2" color={COLORS.grey}>
        version {version}
      </Header>
      <Header color={COLORS.grey}>
        <p>
          configuration editor for{' '}
          <a href="http://www.squid-cache.org/">Squid</a> caching proxy
        </p>
        <p>
          <Icon name="github" />
          Github:{' '}
          <a href="https://github.com/itworks99/sucker">itworks99/sucker</a>
        </p>
        <p>Built with Bottle, Gunicorn, Python, React and Semantic-UI</p>
        <p>
          Created in Sydney with <Icon color={COLORS.pink} name="heart" />
        </p>
      </Header>
    </Dimmer>
  );
}
