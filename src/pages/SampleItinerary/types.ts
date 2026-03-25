export interface TimelineStep {
  time: string;
  activity: string;
  dist: string;
}

export interface ItineraryType {
  id: number;
  title: string;
  image: string;
  price: number;
  maxPeople: number;
  location: string;
  duration: string;
  rating: number;
  category: "all" | "beach" | "culture" | "nature" | "adventure";
  steps: TimelineStep[];
}

export interface FilterState {
  location: string;
  priceRange: string;
  people: number;
}
