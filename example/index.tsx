import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ImageDisplayControl from '../.';

const App = () => {
  return (
    <div>
      <ImageDisplayControl></ImageDisplayControl>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
