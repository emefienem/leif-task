import { gql } from "@apollo/client";

// ==== Queries ====
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      avgHoursPerDay
      dailyCount
      totalHoursLastWeek
    }
  }
`;

export const GET_CARE_WORKERS_CLOCKED_IN = gql`
  query GetCareWorkersClockedIn {
    managerClockedIn {
      id
      name
      role
      email
    }
  }
`;

export const GET_SHIFT_HISTORY = gql`
  query GetShiftHistory {
    getHistory {
      id
      clockInAt
      clockOutAt
      user {
        id
        name
      }
    }
  }
`;

export const GET_GEOFENCE = gql`
  query GetGeoFence {
    getGeoFence {
      id
      lat
      lng
      radiusKm
    }
  }
`;

export const UPSERT_GEOFENCE = gql`
  mutation UpsertGeoFence($lat: Float!, $lng: Float!, $radiusKm: Float!) {
    upsertGeoFence(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
      id
      lat
      lng
      radiusKm
    }
  }
`;

// ==== Interfaces ====
export interface Staff {
  id: string;
  name: string;
  role: string;
}

export interface TimeEntry {
  id: string;
  clockInAt: string;
  clockOutAt: string | null;
  user: {
    id: string;
    name: string;
  };
}

export interface WeeklyHours extends Staff {
  weeklyHours: number;
}
