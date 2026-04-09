export interface PlannerFormData {
  destination: string;
  travelDate: string;
  interests: string[];
  budget: string;
  peopleGroup: string;
}

export interface InterestOption {
  id: string;
  icon: string;
  color: string;
}