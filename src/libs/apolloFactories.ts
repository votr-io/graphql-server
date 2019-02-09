import ApolloClient, { ApolloQueryResult } from 'apollo-client';

export function QueryFactory<TQuery, TQueryVariables = {}>(query: any) {
  return {
    call: (client: ApolloClient<any>, args: TQueryVariables) => {
      return client.query<TQuery, TQueryVariables>({
        query,
        variables: args,
      });
    },
  };
}

export function MutationFactory<TMutation, TMutationVariables = {}>(mutation: any) {
  return {
    call: (client: ApolloClient<any>, args: TMutationVariables) => {
      return client.mutate<TMutation, TMutationVariables>({
        mutation,
        variables: args,
      }) as Promise<ApolloQueryResult<TMutation>>;
    },
  };
}
