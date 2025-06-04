import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Producer, CreateProducerDto, UpdateProducerDto, Farm, CreateFarmDto, UpdateFarmDto, DashboardStats, HealthResponse } from '@libs/types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Producer', 'Farm', 'Dashboard'],
  endpoints: (builder) => ({
    // Health check
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health',
    }),

    // Producers
    getProducers: builder.query<Producer[], void>({
      query: () => '/producers',
      providesTags: ['Producer'],
    }),

    getProducer: builder.query<Producer, string>({
      query: (id) => `/producers/${id}`,
      providesTags: (_, __, id) => [{ type: 'Producer', id }],
    }),

    createProducer: builder.mutation<Producer, CreateProducerDto>({
      query: (newProducer) => ({
        url: '/producers',
        method: 'POST',
        body: newProducer,
      }),
      invalidatesTags: ['Producer', 'Dashboard'],
    }),

    updateProducer: builder.mutation<Producer, { id: string; updates: UpdateProducerDto }>({
      query: ({ id, updates }) => ({
        url: `/producers/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Producer', id }, 'Dashboard'],
    }),

    deleteProducer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/producers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Producer', 'Dashboard'],
    }),

    // Farms
    getFarms: builder.query<Farm[], void>({
      query: () => '/farms',
      providesTags: ['Farm'],
    }),

    getFarm: builder.query<Farm, string>({
      query: (id) => `/farms/${id}`,
      providesTags: (_, __, id) => [{ type: 'Farm', id }],
    }),

    createFarm: builder.mutation<Farm, CreateFarmDto>({
      query: (newFarm) => ({
        url: '/farms',
        method: 'POST',
        body: newFarm,
      }),
      invalidatesTags: ['Farm', 'Dashboard'],
    }),

    updateFarm: builder.mutation<Farm, { id: string; updates: UpdateFarmDto }>({
      query: ({ id, updates }) => ({
        url: `/farms/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Farm', id }, 'Dashboard'],
    }),

    deleteFarm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/farms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Farm', 'Dashboard'],
    }),

    // Dashboard
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetHealthQuery,
  useGetProducersQuery,
  useGetProducerQuery,
  useCreateProducerMutation,
  useUpdateProducerMutation,
  useDeleteProducerMutation,
  useGetFarmsQuery,
  useGetFarmQuery,
  useCreateFarmMutation,
  useUpdateFarmMutation,
  useDeleteFarmMutation,
  useGetDashboardStatsQuery,
} = api; 