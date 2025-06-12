export interface Team {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    sport: string;
    division?: string;
    createdAt: string;
    ownerId: string;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: 'player' | 'coach' | 'manager' | 'owner';
    joinedAt: string;
    status: 'active' | 'inactive' | 'suspended';
}

export interface TeamStats {
    totalMembers: number;
    activeMembers: number;
    upcomingEvents: number;
    pastEvents: number;
    winRate?: number;
    performance?: {
        wins: number;
        losses: number;
        draws: number;
    };
}
