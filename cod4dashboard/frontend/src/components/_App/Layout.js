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
  return (
    <>
      <div className="fixed top-0 w-full">
        <Header {...props.children.props} /> {/* with Footer */}
      </div>
      <div className="flex-col overflow-y-hidden">
        <div className="flex-1 overflow-y-auto m-1 mt-20 mb-8 p-1">
          <main>{props.children}</main>
        </div>
      </div>
    </>
  );
}

export default Layout;
