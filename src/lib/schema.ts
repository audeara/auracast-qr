import { z } from 'zod';

export const formSchema = z
  .object({
    BN: z.string().min(4, 'Minimum 4 characters').max(32, 'Maximum 32 characters'),
    BI: z
      .string()
      .refine(
        (val) => !val || /^[0-9A-Fa-f]{1,6}$/.test(val),
        { message: 'Must be 1–6 hex characters' }
      )
      .default(''),
    AD: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          const stripped = val.replace(/:/g, '');
          return /^[0-9A-Fa-f]{12}$/.test(stripped);
        },
        { message: 'Must be 12 hex characters (colons allowed)' }
      )
      .default(''),
    AT: z.enum(['0', '1']),
    quality: z.enum(['none', 'sq', 'hq', 'both']),
    encrypted: z.boolean(),
    BC: z.string().max(16, 'Maximum 16 characters').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.encrypted && !data.BC) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Broadcast Code is required when encrypted',
        path: ['BC'],
      });
    }
  });

export type FormValues = z.infer<typeof formSchema>;
