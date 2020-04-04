import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
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
export type Election = Node & {
   __typename?: 'Election';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  createdByEmail?: Maybe<Scalars['String']>;
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

export type Mutation = {
   __typename?: 'Mutation';
  /** #election administration */
  upsertElection: UpsertElectionOutput;
  startElection: StartElectionOutput;
  stopElection: StopElectionOutput;
  /** #voting */
  castBallot: CastBallotOutput;
};


export type MutationUpsertElectionArgs = {
  input: UpsertElectionInput;
  electionAccessToken?: Maybe<Scalars['String']>;
};


export type MutationStartElectionArgs = {
  input: StartElectionInput;
  electionAccessToken?: Maybe<Scalars['String']>;
};


export type MutationStopElectionArgs = {
  input: StopElectionInput;
  electionAccessToken?: Maybe<Scalars['String']>;
};


export type MutationCastBallotArgs = {
  input: CastBallotInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
   __typename?: 'Query';
  node?: Maybe<Node>;
  election?: Maybe<Election>;
  electionByToken?: Maybe<Election>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryElectionArgs = {
  id: Scalars['ID'];
};


export type QueryElectionByTokenArgs = {
  electionAccessToken: Scalars['String'];
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
  createdByEmail: Scalars['String'];
  candidates: Array<CandidateInput>;
};

export type UpsertElectionOutput = {
   __typename?: 'UpsertElectionOutput';
  election: Election;
  electionAccessToken: Scalars['String'];
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
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Node: ResolversTypes['Election'],
  Election: ResolverTypeWrapper<Election>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Candidate: ResolverTypeWrapper<Candidate>,
  ElectionStatus: ElectionStatus,
  Results: ResolverTypeWrapper<Results>,
  Round: ResolverTypeWrapper<Round>,
  CandidateVotes: ResolverTypeWrapper<CandidateVotes>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Mutation: ResolverTypeWrapper<{}>,
  UpsertElectionInput: UpsertElectionInput,
  CandidateInput: CandidateInput,
  UpsertElectionOutput: ResolverTypeWrapper<UpsertElectionOutput>,
  StartElectionInput: StartElectionInput,
  StartElectionOutput: ResolverTypeWrapper<StartElectionOutput>,
  StopElectionInput: StopElectionInput,
  StopElectionOutput: ResolverTypeWrapper<StopElectionOutput>,
  CastBallotInput: CastBallotInput,
  CastBallotOutput: ResolverTypeWrapper<CastBallotOutput>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  Node: ResolversParentTypes['Election'],
  Election: Election,
  String: Scalars['String'],
  Candidate: Candidate,
  ElectionStatus: ElectionStatus,
  Results: Results,
  Round: Round,
  CandidateVotes: CandidateVotes,
  Int: Scalars['Int'],
  Mutation: {},
  UpsertElectionInput: UpsertElectionInput,
  CandidateInput: CandidateInput,
  UpsertElectionOutput: UpsertElectionOutput,
  StartElectionInput: StartElectionInput,
  StartElectionOutput: StartElectionOutput,
  StopElectionInput: StopElectionInput,
  StopElectionOutput: StopElectionOutput,
  CastBallotInput: CastBallotInput,
  CastBallotOutput: CastBallotOutput,
  Boolean: Scalars['Boolean'],
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
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  createdByEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dateUpdated?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  candidates?: Resolver<Array<ResolversTypes['Candidate']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['ElectionStatus'], ParentType, ContextType>,
  results?: Resolver<Maybe<ResolversTypes['Results']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  upsertElection?: Resolver<ResolversTypes['UpsertElectionOutput'], ParentType, ContextType, RequireFields<MutationUpsertElectionArgs, 'input'>>,
  startElection?: Resolver<ResolversTypes['StartElectionOutput'], ParentType, ContextType, RequireFields<MutationStartElectionArgs, 'input'>>,
  stopElection?: Resolver<ResolversTypes['StopElectionOutput'], ParentType, ContextType, RequireFields<MutationStopElectionArgs, 'input'>>,
  castBallot?: Resolver<ResolversTypes['CastBallotOutput'], ParentType, ContextType, RequireFields<MutationCastBallotArgs, 'input'>>,
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Election', ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
  election?: Resolver<Maybe<ResolversTypes['Election']>, ParentType, ContextType, RequireFields<QueryElectionArgs, 'id'>>,
  electionByToken?: Resolver<Maybe<ResolversTypes['Election']>, ParentType, ContextType, RequireFields<QueryElectionByTokenArgs, 'electionAccessToken'>>,
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
  electionAccessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Candidate?: CandidateResolvers<ContextType>,
  CandidateVotes?: CandidateVotesResolvers<ContextType>,
  CastBallotOutput?: CastBallotOutputResolvers<ContextType>,
  Election?: ElectionResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Node?: NodeResolvers,
  Query?: QueryResolvers<ContextType>,
  Results?: ResultsResolvers<ContextType>,
  Round?: RoundResolvers<ContextType>,
  StartElectionOutput?: StartElectionOutputResolvers<ContextType>,
  StopElectionOutput?: StopElectionOutputResolvers<ContextType>,
  UpsertElectionOutput?: UpsertElectionOutputResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
