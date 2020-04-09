import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<import('../../user/types').User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Election: ResolverTypeWrapper<import('../../election/types').Election>,
  Candidate: ResolverTypeWrapper<Candidate>,
  ElectionStatus: ElectionStatus,
  Results: ResolverTypeWrapper<Results>,
  Round: ResolverTypeWrapper<Round>,
  CandidateVotes: ResolverTypeWrapper<CandidateVotes>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Mutation: ResolverTypeWrapper<{}>,
  LoginOutput: ResolverTypeWrapper<Omit<LoginOutput, 'user'> & { user: ResolversTypes['User'] }>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  UpsertUserInput: UpsertUserInput,
  UpsertUserOutput: ResolverTypeWrapper<Omit<UpsertUserOutput, 'user'> & { user: ResolversTypes['User'] }>,
  UpsertElectionInput: UpsertElectionInput,
  CandidateInput: CandidateInput,
  UpsertElectionOutput: ResolverTypeWrapper<Omit<UpsertElectionOutput, 'election'> & { election: ResolversTypes['Election'] }>,
  StartElectionInput: StartElectionInput,
  StartElectionOutput: ResolverTypeWrapper<Omit<StartElectionOutput, 'election'> & { election: ResolversTypes['Election'] }>,
  StopElectionInput: StopElectionInput,
  StopElectionOutput: ResolverTypeWrapper<Omit<StopElectionOutput, 'election'> & { election: ResolversTypes['Election'] }>,
  CastBallotInput: CastBallotInput,
  CastBallotOutput: ResolverTypeWrapper<CastBallotOutput>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  User: import('../../user/types').User,
  ID: Scalars['ID'],
  String: Scalars['String'],
  Election: import('../../election/types').Election,
  Candidate: Candidate,
  ElectionStatus: ElectionStatus,
  Results: Results,
  Round: Round,
  CandidateVotes: CandidateVotes,
  Int: Scalars['Int'],
  Mutation: {},
  LoginOutput: Omit<LoginOutput, 'user'> & { user: ResolversParentTypes['User'] },
  Boolean: Scalars['Boolean'],
  UpsertUserInput: UpsertUserInput,
  UpsertUserOutput: Omit<UpsertUserOutput, 'user'> & { user: ResolversParentTypes['User'] },
  UpsertElectionInput: UpsertElectionInput,
  CandidateInput: CandidateInput,
  UpsertElectionOutput: Omit<UpsertElectionOutput, 'election'> & { election: ResolversParentTypes['Election'] },
  StartElectionInput: StartElectionInput,
  StartElectionOutput: Omit<StartElectionOutput, 'election'> & { election: ResolversParentTypes['Election'] },
  StopElectionInput: StopElectionInput,
  StopElectionOutput: Omit<StopElectionOutput, 'election'> & { election: ResolversParentTypes['Election'] },
  CastBallotInput: CastBallotInput,
  CastBallotOutput: CastBallotOutput,
};

export type CandidateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Candidate'] = ResolversParentTypes['Candidate']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CandidateVotesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CandidateVotes'] = ResolversParentTypes['CandidateVotes']> = {
  candidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType>,
  votes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type CastBallotOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['CastBallotOutput'] = ResolversParentTypes['CastBallotOutput']> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ElectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Election'] = ResolversParentTypes['Election']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  candidates?: Resolver<Array<ResolversTypes['Candidate']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['ElectionStatus'], ParentType, ContextType>,
  results?: Resolver<Maybe<ResolversTypes['Results']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LoginOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginOutput'] = ResolversParentTypes['LoginOutput']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  login?: Resolver<ResolversTypes['LoginOutput'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>,
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  upsertUser?: Resolver<ResolversTypes['UpsertUserOutput'], ParentType, ContextType, RequireFields<MutationUpsertUserArgs, 'input'>>,
  upsertElection?: Resolver<ResolversTypes['UpsertElectionOutput'], ParentType, ContextType, RequireFields<MutationUpsertElectionArgs, 'input'>>,
  startElection?: Resolver<ResolversTypes['StartElectionOutput'], ParentType, ContextType, RequireFields<MutationStartElectionArgs, 'input'>>,
  stopElection?: Resolver<ResolversTypes['StopElectionOutput'], ParentType, ContextType, RequireFields<MutationStopElectionArgs, 'input'>>,
  castBallot?: Resolver<ResolversTypes['CastBallotOutput'], ParentType, ContextType, RequireFields<MutationCastBallotArgs, 'input'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  self?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  election?: Resolver<Maybe<ResolversTypes['Election']>, ParentType, ContextType, RequireFields<QueryElectionArgs, 'id'>>,
};

export type ResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']> = {
  winner?: Resolver<ResolversTypes['Candidate'], ParentType, ContextType>,
  replay?: Resolver<Array<ResolversTypes['Round']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type RoundResolvers<ContextType = any, ParentType extends ResolversParentTypes['Round'] = ResolversParentTypes['Round']> = {
  candidateTotals?: Resolver<Array<ResolversTypes['CandidateVotes']>, ParentType, ContextType>,
  redistribution?: Resolver<Maybe<Array<Maybe<ResolversTypes['CandidateVotes']>>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StartElectionOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['StartElectionOutput'] = ResolversParentTypes['StartElectionOutput']> = {
  election?: Resolver<ResolversTypes['Election'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type StopElectionOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['StopElectionOutput'] = ResolversParentTypes['StopElectionOutput']> = {
  election?: Resolver<ResolversTypes['Election'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UpsertElectionOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpsertElectionOutput'] = ResolversParentTypes['UpsertElectionOutput']> = {
  election?: Resolver<ResolversTypes['Election'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UpsertUserOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpsertUserOutput'] = ResolversParentTypes['UpsertUserOutput']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  elections?: Resolver<Array<ResolversTypes['Election']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Candidate?: CandidateResolvers<ContextType>,
  CandidateVotes?: CandidateVotesResolvers<ContextType>,
  CastBallotOutput?: CastBallotOutputResolvers<ContextType>,
  Election?: ElectionResolvers<ContextType>,
  LoginOutput?: LoginOutputResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Results?: ResultsResolvers<ContextType>,
  Round?: RoundResolvers<ContextType>,
  StartElectionOutput?: StartElectionOutputResolvers<ContextType>,
  StopElectionOutput?: StopElectionOutputResolvers<ContextType>,
  UpsertElectionOutput?: UpsertElectionOutputResolvers<ContextType>,
  UpsertUserOutput?: UpsertUserOutputResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
