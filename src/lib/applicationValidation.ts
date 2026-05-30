import { z } from 'zod';

export const loanPurposeSchema = z.enum([
  'Emergency buffer',
  'Credit building',
  'Device purchase',
  'Auto repair',
  'Personal expense',
]);

export const employmentTypeSchema = z.enum([
  'W-2 employee',
  'Contractor',
  'Student',
  'Not listed',
]);

export const simulatedApplicationSchema = z.object({
  purpose: loanPurposeSchema,
  requestedAmount: z.coerce
    .number()
    .min(100, 'Choose a demo amount of at least $100.')
    .max(3000, 'Demo applications are capped at $3,000.'),
  applicantName: z.literal('Maya'),
  profileMode: z.literal('Synthetic demo profile'),
  monthlyIncome: z.coerce
    .number()
    .min(500, 'Use the synthetic income estimate or another demo-only value.')
    .max(10000, 'Use a reasonable demo-only monthly income value.'),
  employmentType: employmentTypeSchema,
  selectedOfferId: z.string().min(1, 'Select a synthetic offer.'),
  demoConsentAccepted: z.boolean().refine((value) => value, {
    message: 'Accept the demo disclosure before submitting.',
  }),
});

export type SimulatedApplicationDraft = z.infer<typeof simulatedApplicationSchema>;

export function validateSimulatedApplication(draft: SimulatedApplicationDraft) {
  return simulatedApplicationSchema.safeParse(draft);
}
