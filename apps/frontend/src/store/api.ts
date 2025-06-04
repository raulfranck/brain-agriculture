import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Producer, CreateProducerDto, UpdateProducerDto, Farm, CreateFarmDto, UpdateFarmDto, DashboardStats, HealthResponse } from '@libs/types';
import type { Crop, CreateCropDto, UpdateCropDto, Harvest, CreateHarvestDto, UpdateHarvestDto } from '@libs/types/crop';

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
  tagTypes: ['Producer', 'Farm', 'Dashboard', 'Crop', 'Harvest'],
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

    // Crops
    getCrops: builder.query<Crop[], void>({
      query: () => '/crops',
      providesTags: ['Crop'],
    }),

    getCrop: builder.query<Crop, string>({
      query: (id) => `/crops/${id}`,
      providesTags: (_, __, id) => [{ type: 'Crop', id }],
    }),

    createCrop: builder.mutation<Crop, CreateCropDto>({
      query: (newCrop) => ({
        url: '/crops',
        method: 'POST',
        body: newCrop,
      }),
      invalidatesTags: ['Crop'],
    }),

    updateCrop: builder.mutation<Crop, { id: string; updates: UpdateCropDto }>({
      query: ({ id, updates }) => ({
        url: `/crops/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Crop', id }],
    }),

    deleteCrop: builder.mutation<void, string>({
      query: (id) => ({
        url: `/crops/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Crop'],
    }),

    // Harvests
    getHarvests: builder.query<Harvest[], string | void>({
      query: (farmId) => farmId ? `/harvests?farmId=${farmId}` : '/harvests',
      providesTags: ['Harvest'],
    }),

    getHarvest: builder.query<Harvest, string>({
      query: (id) => `/harvests/${id}`,
      providesTags: (_, __, id) => [{ type: 'Harvest', id }],
    }),

    createHarvest: builder.mutation<Harvest, CreateHarvestDto>({
      query: (newHarvest) => ({
        url: '/harvests',
        method: 'POST',
        body: newHarvest,
      }),
      invalidatesTags: ['Harvest', 'Dashboard'],
    }),

    updateHarvest: builder.mutation<Harvest, { id: string; updates: UpdateHarvestDto }>({
      query: ({ id, updates }) => ({
        url: `/harvests/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Harvest', id }, 'Dashboard'],
    }),

    deleteHarvest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/harvests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Harvest', 'Dashboard'],
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
  useGetCropsQuery,
  useGetCropQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
  useGetHarvestsQuery,
  useGetHarvestQuery,
  useCreateHarvestMutation,
  useUpdateHarvestMutation,
  useDeleteHarvestMutation,
  useGetDashboardStatsQuery,
} = api; 