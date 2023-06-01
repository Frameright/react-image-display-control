import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ImageDisplayControl } from '@frameright/react-image-display-control';

const App = () => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <div
              style={{
                width: '400px',
                height: '200px',
                resize: 'both',
                overflow: 'hidden', // needed in order the get a bottom-right resize handle
                border: 'solid',
              }}
              data-idc-parent
            >
              <ImageDisplayControl>
                <img
                  src="https://webc.frameright.io/assets/pics/skater.jpg"
                  alt="Skater"
                  style={{
                    width: '50%',
                    height: '100%',
                    verticalAlign: 'top', // avoid spurious margin when height becomes smaller than the font size
                  }}
                />
                <img
                  src="https://webc.frameright.io/assets/pics/birds.jpg"
                  alt="Birds"
                  style={{
                    width: '50%',
                    height: '100%',
                    verticalAlign: 'top', // avoid spurious margin when height becomes smaller than the font size
                  }}
                />
              </ImageDisplayControl>
            </div>
          </td>
        </tr>
        <tr>
          <td align="right">Resize me &#9650;</td>
        </tr>
      </tbody>
    </table>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(<App />);
