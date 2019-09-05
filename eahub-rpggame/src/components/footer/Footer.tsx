import * as React from 'react';
import { Container } from 'semantic-ui-react';

const Footer: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        color: 'white',
        background: 'black',
        textAlign: 'center',
        height: '1.5rem'
      }}
    >
      © 2019, Copyright SAS Institute, Inc.
    </div>
  );
};

export default Footer;
