import { z } from "zod";

export const passwordRecoveryValidator = (obj) => {
  try {
    z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.string(),
      expires_at: z.string(),
      token_type: z.string(),
      type: z.string(),
    }).parse(obj);
    return true;
  } catch (error) {
    throw error;
  }
};
