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
  id: Scalars['ID'];
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
  name: Scalars['String'];
  description: Scalars['String'];
  createdBy: User;
  dateCreated: Scalars['String'];
  dateUpdated: Scalars['String'];
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
  id: Scalars['ID'];
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

export type SelfQueryVariables = {};


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);


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
    upsertUser(variables: UpsertUserMutationVariables): Promise<UpsertUserMutation> {
      return withWrapper(() => client.request<UpsertUserMutation>(print(UpsertUserDocument), variables));
    },
    self(variables?: SelfQueryVariables): Promise<SelfQuery> {
      return withWrapper(() => client.request<SelfQuery>(print(SelfDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;