export interface Decision {
  id: string;
  title: string;
  weight: string;
}

export interface DecisionResponse {
  lastId: number;
  list: Decision[];
}
