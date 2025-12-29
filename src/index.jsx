import React from 'react';
import {createRoot} from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css';

import Sucker from './sucker';

const rootNode = document.getElementById('root');
const root = createRoot(rootNode);

root.render(<Sucker />);
