/* tslint:disable */
// This file was automatically generated and should not be edited.
import ApolloClient, { QueryOptions, MutationOptions } from 'apollo-client';
import gql from 'graphql-tag';

import { AddCandidates, AddCandidatesVariables } from './AddCandidates'
import { CreateElection, CreateElectionVariables } from './CreateElection'
import { DeleteElection, DeleteElectionVariables } from './DeleteElection'
import { GetElections, GetElectionsVariables } from './GetElections'
import { WeakLogin, WeakLoginVariables } from './WeakLogin'

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
    
    GetElections: (variables: GetElectionsVariables, options: Omit<QueryOptions<GetElectionsVariables>, 'query' | 'variables'> = {}) => {
      return client.query<GetElections, GetElectionsVariables>({
        ...options,
        query: GetElectionsQuery,
        variables
      });
    },
    watchGetElections: (variables: GetElectionsVariables, options: Omit<QueryOptions<GetElectionsVariables>, 'query' | 'variables'> = {}) => {
      return client.watchQuery<GetElections, GetElectionsVariables>({
        ...options,
        query: GetElectionsQuery,
        variables
      });
    },

    
    AddCandidates: (variables: AddCandidatesVariables, options: Omit<MutationOptions<AddCandidates, AddCandidatesVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<AddCandidates, AddCandidatesVariables>({
        ...options,
        mutation: AddCandidatesMutation,
        variables
      });
    },

    CreateElection: (variables: CreateElectionVariables, options: Omit<MutationOptions<CreateElection, CreateElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<CreateElection, CreateElectionVariables>({
        ...options,
        mutation: CreateElectionMutation,
        variables
      });
    },

    DeleteElection: (variables: DeleteElectionVariables, options: Omit<MutationOptions<DeleteElection, DeleteElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<DeleteElection, DeleteElectionVariables>({
        ...options,
        mutation: DeleteElectionMutation,
        variables
      });
    },

    WeakLogin: (variables: WeakLoginVariables, options: Omit<MutationOptions<WeakLogin, WeakLoginVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<WeakLogin, WeakLoginVariables>({
        ...options,
        mutation: WeakLoginMutation,
        variables
      });
    },
  
  }
}


  export const AddCandidatesMutation = gql`mutation AddCandidates($candidates:[CreateCandidateInput!]!,$electionId:ID!){addCandidates(input:{electionId:$electionId,candidates:$candidates}){__typename election{__typename adminToken candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const CreateElectionMutation = gql`mutation CreateElection($candidates:[CreateCandidateInput!]!,$description:String!,$email:String,$name:String!){createElection(input:{name:$name,description:$description,candidates:$candidates,email:$email}){__typename election{__typename adminToken candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const DeleteElectionMutation = gql`mutation DeleteElection($id:ID!){deleteElections(input:{ids:[$id]})}`
  
  export const GetElectionsQuery = gql`query GetElections($ids:[ID!]!){getElections(input:{ids:$ids}){__typename elections{__typename id}}}`
  
  export const WeakLoginMutation = gql`mutation WeakLogin($adminToken:String!){weakLogin(input:{adminToken:$adminToken}){__typename accessToken}}`