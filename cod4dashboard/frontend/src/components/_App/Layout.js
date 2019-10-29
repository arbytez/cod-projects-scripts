import Router from 'next/router';
import NProgress from 'nprogress';

import Header from './Header';

import '../../tailwind/tailwind.css';
// import withContext from '../hoc/withContext';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

function Layout(props) {
  let childrenProps = {};
  const { auth = {}, children } = props;
  const { props: childProps = {} } = children;
  childrenProps = { ...{ auth }, ...childProps };
  return (
    <>
      <div className="fixed top-0 w-full">
        <Header {...childrenProps} />
      </div>
      <div className="flex-col overflow-y-hidden">
        <div className="flex-1 overflow-y-auto m-1 mt-20 mb-8 p-1">
          <main className="block mx-auto w-full sm:w-4/5 xl:w-2/3">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
