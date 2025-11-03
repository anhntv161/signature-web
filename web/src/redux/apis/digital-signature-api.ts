import { PrivateKey, PublicKey } from "@/types/key";
import { appApi, BaseRequestParams } from "./api";
import { SignDocs, VerifySignature } from "@/types/digital-signature";

interface SignDocumentsParams extends BaseRequestParams {
  text: unknown;
  private_key: PrivateKey;
}

interface VerifySignatureParams extends BaseRequestParams {
  text: unknown;
  signature: string;
  public_key: PublicKey;
}

export const digitalSignatureApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    signDocuments: build.mutation<SignDocs, SignDocumentsParams>({
      query: ({ text, private_key }) => {
        return {
          url: `/api/sign-docs`,
          method: "POST",
          body: { text, private_key },
        };
      },
    }),

    verifySignature: build.mutation<VerifySignature, VerifySignatureParams>({
      query: ({ text, signature, public_key }) => {
        return {
          url: `/api/verify-signature`,
          method: "POST",
          body: { text, signature, public_key },
        };
      },
    }),
  }),
});

export const { useSignDocumentsMutation, useVerifySignatureMutation } =
  digitalSignatureApi;
