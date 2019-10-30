import { ApolloLink, Observable } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import { split } from 'apollo-link';
import withApollo from 'next-with-apollo';
import { withClientState } from 'apollo-link-state';
import cookies from 'js-cookie';

const createClient = ({ headers = {} }) => {
  const cache = new InMemoryCache();

  const request = async operation => {
    operation.setContext({
      http: {
        includeExtensions: true,
        includeQuery: false
      },
      // fetchOptions: {
      //   credentials: 'include'
      // },
      headers: {
        ...headers,
        authorization: cookies.get('token')
      }
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const httpLink = new BatchHttpLink({
    uri: process.env.ENDPOINT_HTTP
  });

  // Make sure the wsLink is only created on the browser. The server doesn't have a native implemention for websockets
  const wsLink = process.browser
    ? new WebSocketLink({
        uri: process.env.ENDPOINT_WS,
        options: {
          reconnect: true,
          connectionParams: {
            authorization: cookies.get('token')
          }
        }
      })
    : () => {
        console.log('SSR');
      };

  // Let Apollo figure out if the request is over ws or http
  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return (
        kind === 'OperationDefinition' &&
        operation === 'subscription' &&
        process.browser
      );
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          // console.error({ graphQLErrors });
        }
        if (networkError) {
          // console.error({ networkError });
        }
      }),
      requestLink,
      // link,
      withClientState({
        defaults: {
          isConnected: true
        },
        resolvers: {
          Mutation: {
            updateNetworkStatus: (_, { isConnected }, { cache }) => {
              cache.writeData({ data: { isConnected } });
              return null;
            }
          }
        },
        cache
      }),

      // Push the links into the Apollo client
      createPersistedQueryLink().concat(terminatingLink)
    ]),
    cache
  });
};

export default withApollo(createClient);
