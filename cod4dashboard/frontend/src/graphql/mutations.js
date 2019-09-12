const LOGIN_MUTATION = `
  mutation LOGIN_MUTATION(
    $password: String!
  ) {
    login(password: $password)
  }
`;

const LOGOUT_MUTATION = `
  mutation LOGOUT_MUTATION {
    logout
  }
`;

const SEND_RCONCOMMAND_MUTATION = `
  mutation SEND_RCONCOMMAND_MUTATION($command: String!) {
    sendRconCommand(command: $command)
  }
`;

export { LOGIN_MUTATION, LOGOUT_MUTATION, SEND_RCONCOMMAND_MUTATION };
