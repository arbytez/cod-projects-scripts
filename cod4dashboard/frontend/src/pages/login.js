import React from 'react';

import Layout from '../components/_App/Layout';
import { handleLogin } from '../utils/auth';
import catchErrors from '../utils/catchErrors';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useSignInMutation } from '../generated/js/graphql';

const INITIAL_USER = {
  email: 'user1@example.com',
  password: 'user1'
};

const LoginPage = () => {
  const [user, setUser] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [signIn] = useSignInMutation();

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await signIn({
        variables: { email: user.email, password: user.password }
      });
      if (res.errors) {
        catchErrors(res.errors, setError);
      } else {
        handleLogin(res.data.signIn.token);
      }
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h3 className="text-2xl font-semibold">Login</h3>
      <form
        onSubmit={handleSubmit}
        className="block mt-8 mx-auto w-full sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4"
      >
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            className="form-input mt-1 block w-full"
            placeholder="email@example.com"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label className="block mt-2 ">
          <span className="text-gray-700">Password</span>
          <input
            className="form-input mt-1 block w-full"
            placeholder="Password"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </label>
        <div>
          <button
            type="submit"
            className="mt-4 btn btn-primary"
            disabled={disabled || loading}
          >
            Login
          </button>
        </div>
        <div className="mt-8">
          <ErrorMessage message={error} />
        </div>
      </form>
    </>
  );
};

LoginPage.getLayout = page => <Layout>{page}</Layout>;

export default LoginPage;
