import { fetcher } from "@/lib/api-client";
import { loginMutationResponseSchema } from "@shared/zod-schemas/auth/login";

import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: () => {
      return fetcher.post({
        url: "/auth/login",
        schema: loginMutationResponseSchema,
        body: {
          siemano: "l",
        },
      });
    },
    // onSuccess: (d) => console.log(d),
    onError: (e) => {
      console.log(e);
    },
  });
};
