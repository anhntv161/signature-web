import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BaseRequestParams {
  [key: string]: unknown;
}

export interface ErrorResponse {
  detail: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const appApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
