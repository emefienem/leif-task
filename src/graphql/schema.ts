import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  enum Role {
    MANAGER
    CARE_WORKER
  }
  type User {
    id: ID!
    email: String!
    name: String
    role: Role
    shifts: [Shift!]!
    managerId: String
    geoFence: GeoFence
  }
  type Shift {
    id: ID!
    clockInAt: String!
    clockOutAt: String
    clockInNote: String
    clockOutNote: String
    clockInLat: Float
    clockInLng: Float
    clockOutLat: Float
    clockOutLng: Float
    user: User
  }
  type GeoFence {
    id: ID!
    lat: Float
    lng: Float
    radiusKm: Float
    manager: User
  }
  type DashboardStats {
    avgHoursPerDay: Float
    dailyCount: Float
    totalHoursLastWeek: Float
  }

  type Query {
    me: User
    getHistory: [Shift!]
    managerClockedIn: [User!]
    getHistoryForWorkers(userId: ID!): [Shift!]
    getDashboardStats: DashboardStats!
    getGeoFence: GeoFence
  }

  type Mutation {
    upsertGeoFence(lat: Float!, lng: Float!, radiusKm: Float!): GeoFence!
    clockIn(lat: Float!, lng: Float!, note: String): Shift!
    clockOut(lat: Float!, lng: Float!, note: String): Shift!
  }
`;
