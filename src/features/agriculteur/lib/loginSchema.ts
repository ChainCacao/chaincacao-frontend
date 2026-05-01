import { z } from 'zod';

export const loginSchema = z.object({
  internalId: z.string()
    .min(5, "L'identifiant est trop court")
    .regex(/^AGR-TG-\d+$/, "Format invalide (Ex: AGR-TG-001)"),
});

export type LoginFormData = z.infer<typeof loginSchema>;