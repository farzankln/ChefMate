import { RecipeInstruction, RecipeStep } from "@/types/recipe";

// Define types for different instruction formats
interface StepObject {
  step?: string;
  instruction?: string;
}

export function normalizeInstructions(
  instructions:
    | RecipeInstruction[]
    | StepObject[]
    | string[]
    | string
    | unknown
    | null
    | undefined
): string[] {
  if (!instructions) return [];

  // Spoonacular analyzedInstructions
  if (Array.isArray(instructions)) {
    // case: [{ steps: [...] }] - RecipeInstruction[]
    if (
      instructions.length > 0 &&
      typeof instructions[0] === "object" &&
      instructions[0] !== null &&
      "steps" in instructions[0] &&
      Array.isArray(instructions[0].steps)
    ) {
      const firstInstruction = instructions[0] as RecipeInstruction;
      return firstInstruction.steps.map(
        (s: RecipeStep, i: number) => s.step || `Step ${i + 1}`
      );
    }

    // case: [{ step: "text" }] - StepObject[]
    if (
      instructions.length > 0 &&
      typeof instructions[0] === "object" &&
      instructions[0] !== null &&
      !("steps" in instructions[0])
    ) {
      return instructions.map(
        (s: StepObject, i: number) => s.step || s.instruction || `Step ${i + 1}`
      );
    }

    // case: ["text", "text"] - string[]
    if (instructions.length > 0 && typeof instructions[0] === "string") {
      return instructions as string[];
    }
  }

  // case: single string
  if (typeof instructions === "string") {
    return [instructions];
  }

  return [];
}
