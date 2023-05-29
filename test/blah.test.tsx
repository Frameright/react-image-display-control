import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ImageDisplayControl from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ImageDisplayControl></ImageDisplayControl>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
