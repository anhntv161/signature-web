import { appApi, BaseRequestParams } from "./api";
import { RSAKeys } from "@/types/key";

interface GenerateKeyParams extends BaseRequestParams {
  p?: number | null;
  q?: number | null;
}

export const keyApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    generateKeys: build.mutation<RSAKeys, GenerateKeyParams>({
      query: (params) => {
        return {
          url: `/api/generate-keys`,
          method: "POST",
          body: {
            p: params.p || null,
            q: params.q || null,
          },
        };
      },
    }),
  }),
});

export const { useGenerateKeysMutation } = keyApi;
