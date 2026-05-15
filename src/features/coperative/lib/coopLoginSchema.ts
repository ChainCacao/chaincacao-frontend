import { z } from 'zod';

export const coopLoginSchema = z.object({
  internalId: z.string().min(3, "L'identifiant est trop court"),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type CoopLoginFormData = z.infer<typeof coopLoginSchema>;
