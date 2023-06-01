import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ImageDisplayControl } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<ImageDisplayControl></ImageDisplayControl>);
    root.unmount();
  });
});
