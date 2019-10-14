import gql from 'graphql-tag';

const USER_SUBSCRIPTION = gql`
  subscription USER_SUBSCRIPTION {
    user {
      mutation
      node {
        id
        username
        email
        roles
      }
    }
  }
`;

export { USER_SUBSCRIPTION };
