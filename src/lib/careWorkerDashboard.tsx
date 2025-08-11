import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

export const GET_HISTORY = gql`
  query GetHistory($userId: ID!) {
    getHistoryForWorkers(userId: $userId) {
      id
      clockInAt
      clockOutAt
      clockInLat
      clockInLng
      clockOutLat
      clockOutLng
      clockInNote
      clockOutNote
      user {
        id
      }
    }
  }
`;

export const CLOCK_IN = gql`
  mutation ClockIn($lat: Float!, $lng: Float!, $note: String) {
    clockIn(lat: $lat, lng: $lng, note: $note) {
      id
      clockInAt
    }
  }
`;

export const CLOCK_OUT = gql`
  mutation ClockOut($lat: Float!, $lng: Float!, $note: String) {
    clockOut(lat: $lat, lng: $lng, note: $note) {
      id
      clockOutAt
    }
  }
`;

// ==== Interfaces ====
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface MeData {
  me: User | null;
}

export interface ShiftEntry {
  id: string;
  clockInAt: string; // ISO date string
  clockOutAt: string | null;
  clockInLat: number;
  clockInLng: number;
  clockOutLat: number | null;
  clockOutLng: number | null;
  clockInNote: string | null;
  clockOutNote: string | null;
  user: {
    id: string;
  };
}

export interface HistoryData {
  getHistoryForWorkers: ShiftEntry[];
}

export interface ClockInOutVars {
  lat: number;
  lng: number;
  note?: string;
}

export interface ClockInOutData {
  clockIn?: {
    id: string;
    clockInAt: string;
  };
  clockOut?: {
    id: string;
    clockOutAt: string;
  };
}
