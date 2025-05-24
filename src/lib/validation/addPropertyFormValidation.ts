import { z } from 'zod';

export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Property name is required')
    .max(100, 'Name too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description too long'),
  address: z.string().min(1, 'Address is required'),
  contactPhone: z
    .string()
    .min(10, 'Valid phone number required')
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format'),
  contactEmail: z.string().email('Valid email required'),
});

export const propertyDetailSchema = z.object({
  sports: z.array(z.string()).min(1, 'At least one sport must be selected'),
  subUnits: z.record(z.string(), z.number().min(0)),
  surfaceType: z.string().min(1, 'Surface type is required'),
  facilities: z.array(z.string()),
  equipmentRental: z.boolean(),
  accessibility: z.array(z.string()),
  additionalAmenities: z.array(z.string()),
});

export const timingAndAvailabilitySchema = z.object({
  openingHours: z.object({
    open: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  }),
  bookingMode: z.enum(['slots', 'full-day']),
  slotDuration: z
    .number()
    .min(15, 'Minimum slot duration is 15 minutes')
    .max(480, 'Maximum slot duration is 8 hours'),
  maxAdvanceDays: z
    .number()
    .min(1, 'Minimum 1 day advance booking')
    .max(365, 'Maximum 365 days advance booking'),
  minNoticeHours: z
    .number()
    .min(0, 'Minimum notice cannot be negative')
    .max(72, 'Maximum 72 hours notice'),
});

export const bookingAndPricingSchema = z.object({
  pricingModel: z.enum(['hourly', 'daily', 'mixed']),
  baseRate: z.number().min(0, 'Base rate must be a positive number'),
  additionalFees: z
    .object({
      lightingFee: z.number().min(0).optional(),
      equipmentFee: z.number().min(0).optional(),
      maintenanceSurcharge: z.number().min(0).optional(),
    })
    .optional(),
  securityDeposit: z.number().min(0, 'Security deposit must be zero or more'),

  preBooking: z.boolean(),
  fullDayBooking: z.boolean(),
  discounts: z
    .object({
      earlyBirdPercent: z.number().min(0).max(100).optional(),
      multiDayDiscountPercent: z.number().min(0).max(100).optional(),
    })
    .optional(),
  cancellationPolicy: z.object({
    freeWindowHours: z
      .number()
      .min(0, 'Free cancellation window must be zero or more'),
    feePercent: z.number().min(0).max(100, 'Fee cannot exceed 100%'),
    noShowCharge: z.number().min(0, 'No-show charge must be zero or more'),
  }),
});

export const mediaSchema = z.object({
  images: z.array(z.string()).min(1, 'At least one image is required'),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  floorPlan: z.string().optional(),
});

export const propertyFormSchema = z.object({
  basicInfo: basicInfoSchema,
  propertyDetail: propertyDetailSchema,
  timingAndAvailability: timingAndAvailabilitySchema,
  bookingAndPricing: bookingAndPricingSchema,
  media: mediaSchema,
});

export const stepSchemas = {
  basicInfo: basicInfoSchema,
  propertyDetail: propertyDetailSchema,
  timingAndAvailability: timingAndAvailabilitySchema,
  bookingAndPricing: bookingAndPricingSchema,
  media: mediaSchema,
} as const;

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type PropertyDetailFormData = z.infer<typeof propertyDetailSchema>;
export type TimingAndAvailabilityFormData = z.infer<
  typeof timingAndAvailabilitySchema
>;
export type BookingAndPricingFormData = z.infer<typeof bookingAndPricingSchema>;
export type MediaFormData = z.infer<typeof mediaSchema>;
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
