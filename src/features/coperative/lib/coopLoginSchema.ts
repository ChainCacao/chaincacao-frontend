import { z } from 'zod';

export const coopLoginSchema = z.object({
  internalId: z.string()
    .min(5, "L'identifiant est trop court")
    .regex(/^COOP-[A-Z]+-\d{4}$/, "Format invalide (Ex: COOP-KARA-2026)"),
});

export type CoopLoginFormData = z.infer<typeof coopLoginSchema>;
