import React from 'react';
import useForm from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useAlert } from 'react-alert';
import { useMount } from 'react-use';

import { SIGNIN_MUTATION } from '../../graphql/mutations';
import { handleLogin } from '../../helpers/auth';
import { getGraphQlError } from '../../helpers/utils';

function LoginForm() {
  const alert = useAlert();
  const { register, handleSubmit, watch, errors } = useForm();
  const [signIn, { loading, error }] = useMutation(SIGNIN_MUTATION);

  useMount(() => {
    document.querySelector('input').focus();
  });

  const onSubmit = async formData => {
    try {
      const res = await signIn({
        variables: { email: formData.email, password: formData.password }
      });
      handleLogin(res.data.signIn.token);
    } catch (error) {
      alert.error(getGraphQlError(error));
    }
  };

  React.useEffect(() => {
    if (errors.email || errors.password) {
      alert.info('This field is required', {
        timeout: 2000
      });
    }
  }, [errors, error]);

  return (
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <label className="w-full">
          <span className="font-semibold">Email</span>
          <input
            type="text"
            name="email"
            className={`${
              errors.email || error ? 'form-input-error' : ''
            } form-input mt-1 block w-full`}
            placeholder="Email"
            ref={register({ required: true })}
          />
        </label>
        <label className="mt-2 block">
          <span className="font-semibold">Password</span>
          <input
            name="password"
            type="password"
            className={`${
              errors.password || error ? 'form-input-error' : ''
            } form-input mt-1 block w-full`}
            placeholder="Password"
            ref={register({ required: true })}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 btn btn-primary w-32"
        >
          {loading ? 'Signing In' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
