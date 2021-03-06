import React from 'react';

import Context from '../../store/context';
import reducer from '../../store/reducer';

const withContext = Component => props => {
  const initialState = React.useContext(Context);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <Component {...props} />
    </Context.Provider>
  );
};

withContext.getInitialProps = async args => {
  const pageProps =
    (await Component.getInitialProps) &&
    (await Component.getInitialProps(args));

  return { ...pageProps };
};

export default withContext;
