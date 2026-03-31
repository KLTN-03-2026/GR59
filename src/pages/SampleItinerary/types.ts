export interface TimelineStep {
  time: string;
  activity: string;
  dist: string;
}

export interface ItineraryType {
  id: string | number;
  title: string;
  img: string;
  price: number;
  maxPeople: number;
  location: string;
  duration: string;
  rating: number;
  category: string;
  type?: string;
  steps: TimelineStep[];
}

export interface FilterState {
  location: string;
  priceRange: string;
  people: number;
}
