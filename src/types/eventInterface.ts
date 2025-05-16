export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'practice' | 'match' | 'tournament' | 'meeting';
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  teamId: string;
  createdBy: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;
  status: 'confirmed' | 'pending' | 'declined';
  role: 'player' | 'coach' | 'referee' | 'staff';
  joinedAt: string;
}

export interface EventStats {
  totalParticipants: number;
  confirmedParticipants: number;
  attendance: {
    present: number;
    absent: number;
    late: number;
  };
  performance?: {
    score?: {
      home: number;
      away: number;
    };
    highlights?: string[];
  };
}
