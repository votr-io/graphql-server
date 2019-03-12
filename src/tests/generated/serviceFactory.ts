/* tslint:disable */
// This file was automatically generated and should not be edited.
import ApolloClient, { QueryOptions, MutationOptions } from 'apollo-client';
import gql from 'graphql-tag';

import { AddCandidates, AddCandidatesVariables } from './AddCandidates'
import { CastBallot, CastBallotVariables } from './CastBallot'
import { CreateElection, CreateElectionVariables } from './CreateElection'
import { DeleteElection, DeleteElectionVariables } from './DeleteElection'
import { GetElections, GetElectionsVariables } from './GetElections'
import { RemoveCandidates, RemoveCandidatesVariables } from './RemoveCandidates'
import { SetStatus, SetStatusVariables } from './SetStatus'
import { UpdateElection, UpdateElectionVariables } from './UpdateElection'
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

    CastBallot: (variables: CastBallotVariables, options: Omit<MutationOptions<CastBallot, CastBallotVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<CastBallot, CastBallotVariables>({
        ...options,
        mutation: CastBallotMutation,
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

    RemoveCandidates: (variables: RemoveCandidatesVariables, options: Omit<MutationOptions<RemoveCandidates, RemoveCandidatesVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<RemoveCandidates, RemoveCandidatesVariables>({
        ...options,
        mutation: RemoveCandidatesMutation,
        variables
      });
    },

    SetStatus: (variables: SetStatusVariables, options: Omit<MutationOptions<SetStatus, SetStatusVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<SetStatus, SetStatusVariables>({
        ...options,
        mutation: SetStatusMutation,
        variables
      });
    },

    UpdateElection: (variables: UpdateElectionVariables, options: Omit<MutationOptions<UpdateElection, UpdateElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<UpdateElection, UpdateElectionVariables>({
        ...options,
        mutation: UpdateElectionMutation,
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


  export const AddCandidatesMutation = gql`mutation AddCandidates($candidates:[CreateCandidateInput!]!,$electionId:ID!){addCandidates(input:{electionId:$electionId,candidates:$candidates}){__typename election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const CastBallotMutation = gql`mutation CastBallot($candidateIds:[ID!]!,$electionId:ID!){castBallot(input:{electionId:$electionId,candidateIds:$candidateIds})}`
  
  export const CreateElectionMutation = gql`mutation CreateElection($candidates:[CreateCandidateInput!]!,$description:String!,$email:String,$name:String!){createElection(input:{name:$name,description:$description,candidates:$candidates,email:$email}){__typename adminToken election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const DeleteElectionMutation = gql`mutation DeleteElection($id:ID!){deleteElections(input:{ids:[$id]})}`
  
  export const GetElectionsQuery = gql`query GetElections($ids:[ID!]!){getElections(input:{ids:$ids}){__typename elections{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const RemoveCandidatesMutation = gql`mutation RemoveCandidates($candidateIds:[ID!]!,$electionId:ID!){removeCandidates(input:{electionId:$electionId,candidateIds:$candidateIds}){__typename election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const SetStatusMutation = gql`mutation SetStatus($electionId:ID!,$status:ElectionStatus!){setStatus(input:{electionId:$electionId,status:$status}){__typename election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const UpdateElectionMutation = gql`mutation UpdateElection($candidates:[CreateCandidateInput!],$description:String,$electionId:ID!,$name:String){updateElection(input:{electionId:$electionId,name:$name,description:$description,candidates:$candidates}){__typename election{__typename candidates{__typename description id name}createdBy{__typename email id}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const WeakLoginMutation = gql`mutation WeakLogin($adminToken:String!){weakLogin(input:{adminToken:$adminToken}){__typename accessToken}}`