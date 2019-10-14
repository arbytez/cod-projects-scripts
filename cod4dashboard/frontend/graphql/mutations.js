import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $username: String!
    $password: String!
  ) {
    signUp(email: $email, username: $username, password: $password) {
      user {
        id
        username
        email
        roles
      }
      token
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user {
        id
        username
        email
        roles
      }
      token
    }
  }
`;

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signOut
  }
`;

export { SIGNUP_MUTATION, SIGNIN_MUTATION, SIGNOUT_MUTATION };
