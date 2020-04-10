import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** A candidate in a specific election. */
export type Candidate = {
   __typename?: 'Candidate';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type CandidateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  description: Scalars['String'];
};

/**
 * Votes associated with a candidate.
 * Can be used for:
 *   - number of votes a candidate recieved in a round
 *   - number of votes being redistributed to a candidate in the event there's more than one round
 * 
 * Note: if canditate is null, that means that these votes no longer have a valid
 * candidate to count towards (all the candidates on these ballots have been
 * dropped from the election due to being in last place in previous rounds)
 */
export type CandidateVotes = {
   __typename?: 'CandidateVotes';
  candidate?: Maybe<Candidate>;
  votes: Scalars['Int'];
};

export type CastBallotInput = {
  electionId: Scalars['ID'];
  candidateIds: Array<Scalars['ID']>;
};

export type CastBallotOutput = {
   __typename?: 'CastBallotOutput';
  _?: Maybe<Scalars['Boolean']>;
};

/** An election. */
export type Election = {
   __typename?: 'Election';
  id: Scalars['ID'];
  createdBy: User;
  name: Scalars['String'];
  description: Scalars['String'];
  candidates: Array<Candidate>;
  status: ElectionStatus;
  results?: Maybe<Results>;
};

/**
 * Possible statuses an election can be in.
 * Transitions only go in one direction.  There's no going back.
 */
export enum ElectionStatus {
  Setup = 'SETUP',
  Open = 'OPEN',
  Tallying = 'TALLYING',
  Closed = 'CLOSED'
}

export type LoginOutput = {
   __typename?: 'LoginOutput';
  user: User;
};

export type Mutation = {
   __typename?: 'Mutation';
  login: LoginOutput;
  logout?: Maybe<Scalars['Boolean']>;
  upsertUser: UpsertUserOutput;
  upsertElection: UpsertElectionOutput;
  startElection: StartElectionOutput;
  stopElection: StopElectionOutput;
  castBallot: CastBallotOutput;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpsertUserArgs = {
  input: UpsertUserInput;
};


export type MutationUpsertElectionArgs = {
  input: UpsertElectionInput;
};


export type MutationStartElectionArgs = {
  input: StartElectionInput;
};


export type MutationStopElectionArgs = {
  input: StopElectionInput;
};


export type MutationCastBallotArgs = {
  input: CastBallotInput;
};

export type Query = {
   __typename?: 'Query';
  self?: Maybe<User>;
  election?: Maybe<Election>;
};


export type QueryElectionArgs = {
  id: Scalars['ID'];
};

/** The winner of the election and all of the data needed to show how the election was won. */
export type Results = {
   __typename?: 'Results';
  winner: Candidate;
  replay: Array<Round>;
};

/**
 * Information about a specific round of an election.
 * If this is the final round of the election, redistribution will be null,
 *   candidateTotals - the number of votes each candidate is awarded this round
 *   redistribution - the number of votes being redistributed to each candidate
 * (does not include the last place candidate for this round)
 */
export type Round = {
   __typename?: 'Round';
  candidateTotals: Array<CandidateVotes>;
  redistribution?: Maybe<Array<Maybe<CandidateVotes>>>;
};

export type StartElectionInput = {
  electionId: Scalars['ID'];
};

export type StartElectionOutput = {
   __typename?: 'StartElectionOutput';
  election: Election;
};

export type StopElectionInput = {
  electionId: Scalars['ID'];
};

export type StopElectionOutput = {
   __typename?: 'StopElectionOutput';
  election: Election;
};

export type UpsertElectionInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  description: Scalars['String'];
  candidates: Array<CandidateInput>;
};

export type UpsertElectionOutput = {
   __typename?: 'UpsertElectionOutput';
  election: Election;
};

export type UpsertUserInput = {
  id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type UpsertUserOutput = {
   __typename?: 'UpsertUserOutput';
  user: User;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  elections: Array<Election>;
};

export type LoginMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginOutput' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type StartElectionMutationVariables = {
  input: StartElectionInput;
};


export type StartElectionMutation = (
  { __typename?: 'Mutation' }
  & { startElection: (
    { __typename?: 'StartElectionOutput' }
    & { election: (
      { __typename?: 'Election' }
      & Pick<Election, 'id' | 'name' | 'description' | 'status'>
      & { createdBy: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'email'>
      ), candidates: Array<(
        { __typename?: 'Candidate' }
        & Pick<Candidate, 'id' | 'name' | 'description'>
      )> }
    ) }
  ) }
);

export type UpsertElectionMutationVariables = {
  input: UpsertElectionInput;
};


export type UpsertElectionMutation = (
  { __typename?: 'Mutation' }
  & { upsertElection: (
    { __typename?: 'UpsertElectionOutput' }
    & { election: (
      { __typename?: 'Election' }
      & Pick<Election, 'id' | 'name' | 'description' | 'status'>
      & { createdBy: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'email'>
      ), candidates: Array<(
        { __typename?: 'Candidate' }
        & Pick<Candidate, 'id' | 'name' | 'description'>
      )> }
    ) }
  ) }
);

export type UpsertUserMutationVariables = {
  input: UpsertUserInput;
};


export type UpsertUserMutation = (
  { __typename?: 'Mutation' }
  & { upsertUser: (
    { __typename?: 'UpsertUserOutput' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type GetElectionQueryVariables = {
  id: Scalars['ID'];
};


export type GetElectionQuery = (
  { __typename?: 'Query' }
  & { election?: Maybe<(
    { __typename?: 'Election' }
    & Pick<Election, 'id' | 'name' | 'description' | 'status'>
    & { createdBy: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ), candidates: Array<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id' | 'name' | 'description'>
    )> }
  )> }
);

export type SelfQueryVariables = {};


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);


export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      email
    }
  }
}
    `;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export const StartElectionDocument = gql`
    mutation startElection($input: StartElectionInput!) {
  startElection(input: $input) {
    election {
      id
      name
      description
      createdBy {
        id
        email
      }
      candidates {
        id
        name
        description
      }
      status
    }
  }
}
    `;
export const UpsertElectionDocument = gql`
    mutation upsertElection($input: UpsertElectionInput!) {
  upsertElection(input: $input) {
    election {
      id
      name
      description
      createdBy {
        id
        email
      }
      candidates {
        id
        name
        description
      }
      status
    }
  }
}
    `;
export const UpsertUserDocument = gql`
    mutation upsertUser($input: UpsertUserInput!) {
  upsertUser(input: $input) {
    user {
      id
      email
    }
  }
}
    `;
export const GetElectionDocument = gql`
    query getElection($id: ID!) {
  election(id: $id) {
    id
    name
    description
    createdBy {
      id
      email
    }
    candidates {
      id
      name
      description
    }
    status
  }
}
    `;
export const SelfDocument = gql`
    query self {
  self {
    id
    email
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    login(variables: LoginMutationVariables): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(print(LoginDocument), variables));
    },
    logout(variables?: LogoutMutationVariables): Promise<LogoutMutation> {
      return withWrapper(() => client.request<LogoutMutation>(print(LogoutDocument), variables));
    },
    startElection(variables: StartElectionMutationVariables): Promise<StartElectionMutation> {
      return withWrapper(() => client.request<StartElectionMutation>(print(StartElectionDocument), variables));
    },
    upsertElection(variables: UpsertElectionMutationVariables): Promise<UpsertElectionMutation> {
      return withWrapper(() => client.request<UpsertElectionMutation>(print(UpsertElectionDocument), variables));
    },
    upsertUser(variables: UpsertUserMutationVariables): Promise<UpsertUserMutation> {
      return withWrapper(() => client.request<UpsertUserMutation>(print(UpsertUserDocument), variables));
    },
    getElection(variables: GetElectionQueryVariables): Promise<GetElectionQuery> {
      return withWrapper(() => client.request<GetElectionQuery>(print(GetElectionDocument), variables));
    },
    self(variables?: SelfQueryVariables): Promise<SelfQuery> {
      return withWrapper(() => client.request<SelfQuery>(print(SelfDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;