interface Node {
  id: string;
}

interface Election {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  createdByEmail?: string;
  name: string;
  description: string;
  candidates: Candidate[];
  results?: Results;
}

interface Candidate {
  id: string;
  name: string;
  description: string;
}

interface Results {
  //TODO
}
