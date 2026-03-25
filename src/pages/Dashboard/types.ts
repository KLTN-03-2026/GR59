export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface TripPlan {
  id: string;
  title: string;
  dateRange: string;
  locationCount: number;
  guestCount: number;
  duration: string;
  activityCount: number;
  hotelCount: number;
  status: 'upcoming' | 'completed';
  image: string;
  checklist: ChecklistItem[];
}