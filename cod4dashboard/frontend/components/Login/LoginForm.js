import React from 'react';
import useForm from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';

import ErrorMessage from '../Shared/ErrorMessage';
import { SIGNIN_MUTATION } from '../../graphql/mutations';
import { handleLogin } from '../../helpers/auth';

function LoginForm() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [signIn, { loading, error }] = useMutation(SIGNIN_MUTATION);

  const onSubmit = async formData => {
    console.log(formData);
    try {
      const res = await signIn({
        variables: { email: formData.email, password: formData.password }
      });
      handleLogin(res.data.signIn.token);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span>Email</span>
        <input
          name="email"
          className="form-input mt-1 block w-full max-w-md"
          placeholder="Email"
          ref={register({ required: true })}
        />
      </label>
      <label className="mt-4 block">
        <span>Password</span>
        <input
          name="password"
          type="password"
          className="form-input mt-1 block w-full max-w-md"
          placeholder="Password"
          ref={register({ required: true })}
        />
      </label>
      {errors.password && <span>This field is required</span>}

      <button type="submit" disabled={loading} className="mt-8 btn btn-primary">
        Sign In
      </button>

      <ErrorMessage error={error} />
    </form>
  );
}

export default LoginForm;
