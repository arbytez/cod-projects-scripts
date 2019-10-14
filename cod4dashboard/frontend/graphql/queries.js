import gql from 'graphql-tag';

const ME_QUERY = gql`
  query ME_QUERY {
    me {
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

export { ME_QUERY };
