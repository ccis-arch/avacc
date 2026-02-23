import { describe, expect, it } from "vitest";
import { z } from "zod";

// Test the validation schema used in the form
const petRegistrationSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  breedId: z.string().min(1, "Breed is required"),
  dateOfBirth: z.date().optional(),
  microchipId: z.string().optional(),
  notes: z.string().optional(),
});

describe("Pet Registration Form Validation", () => {
  it("validates pet name is required", () => {
    const result = petRegistrationSchema.safeParse({
      name: "",
      breedId: "1",
    });
    expect(result.success).toBe(false);
  });

  it("validates breed is required", () => {
    const result = petRegistrationSchema.safeParse({
      name: "Fluffy",
      breedId: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid pet registration data", () => {
    const result = petRegistrationSchema.safeParse({
      name: "Fluffy",
      breedId: "1",
      dateOfBirth: new Date("2020-01-15"),
      microchipId: "123456789",
      notes: "Friendly and playful",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = petRegistrationSchema.safeParse({
      name: "Fluffy",
      breedId: "1",
    });
    expect(result.success).toBe(true);
  });

  it("validates date of birth is a date object", () => {
    const result = petRegistrationSchema.safeParse({
      name: "Fluffy",
      breedId: "1",
      dateOfBirth: "2020-01-15",
    });
    expect(result.success).toBe(false);
  });
});
