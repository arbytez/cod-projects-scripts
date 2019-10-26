import Router from 'next/router';
import NProgress from 'nprogress';

import Header from './Header';

import '../../tailwind/tailwind.css';

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
        <div className="flex-1 overflow-y-auto m-4 mt-20 p-4">
          <main>{props.children}</main>
        </div>
      </div>
    </>
  );
}

export default Layout;
