/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Possible statuses an election can be in.
 * Transitions only go in one direction.  There's no going back.
 */
export enum ElectionStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  PENDING = "PENDING",
  TALLYING = "TALLYING",
}

export interface CreateCandidateInput {
  name: string;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
