/* tslint:disable */
// This file was automatically generated and should not be edited.
import ApolloClient, { MutationOptions } from 'apollo-client';
import gql from 'graphql-tag';

import { CreateElection, CreateElectionVariables } from './CreateElection'

//can be removed if this bug is fixed:
//https://github.com/apollographql/apollo-client/issues/2795
import { ExecutionResult } from 'graphql';
declare module 'apollo-link' {
  export type FetchResult<
    TData = { [key: string]: any },
    C = Record<string, any>,
    E = Record<string, any>
  > = ExecutionResult<TData> & {
    extensions?: E;
    context?: C;
  };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export function createService(client: ApolloClient<any>) {
  return {
    
    
    CreateElection: (variables: CreateElectionVariables, options: Omit<MutationOptions<CreateElection, CreateElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<CreateElection, CreateElectionVariables>({
        ...options,
        mutation: CreateElectionMutation,
        variables
      });
    },
  
  }
}


  export const CreateElectionMutation = gql`mutation CreateElection($candidates:[CreateCandidateInput!]!,$description:String!,$email:String,$name:String!){createElection(input:{name:$name,description:$description,candidates:$candidates,email:$email}){__typename election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`