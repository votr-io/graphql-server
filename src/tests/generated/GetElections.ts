/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetElections
// ====================================================

export interface GetElections_getElections_elections {
  __typename: "Election";
  id: string;
}

export interface GetElections_getElections {
  __typename: "GetElectionsResponse";
  elections: GetElections_getElections_elections[];
}

export interface GetElections {
  getElections: GetElections_getElections | null;
}

export interface GetElectionsVariables {
  ids: string[];
}
