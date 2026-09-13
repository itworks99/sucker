// @ts-expect-error React's compatibility import is required by Semantic UI.
import React from 'react';
import {createRoot} from 'react-dom/client';
// @ts-expect-error Semantic UI does not publish CSS module declarations.
import 'semantic-ui-css/semantic.min.css';

import Sucker from './sucker';

const rootNode = document.getElementById('root');
if (!rootNode) throw new Error('Root element not found');
const root = createRoot(rootNode);

root.render(<Sucker />);
