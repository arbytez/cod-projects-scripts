import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import Context from '../../state/context';

function Loader() {
  const { state, dispatch } = React.useContext(Context);
  return (
    <div className="fixed top-0 right-0 m-2">
      <ClipLoader
        size={1.2}
        sizeUnit={'em'}
        color="#fff"
        loading={state.loading}
      />
    </div>
  );
}

export default Loader;
