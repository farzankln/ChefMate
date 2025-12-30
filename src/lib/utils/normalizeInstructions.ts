// utils/normalizeInstructions.ts
export function normalizeInstructions(instructions: any): string[] {
  if (!instructions) return [];

  // Spoonacular analyzedInstructions
  if (Array.isArray(instructions)) {
    // case: [{ steps: [...] }]
    if (instructions[0]?.steps) {
      return instructions[0].steps.map(
        (s: any, i: number) => s.step || `Step ${i + 1}`
      );
    }

    // case: [{ step: "text" }]
    if (typeof instructions[0] === "object") {
      return instructions.map(
        (s: any, i: number) => s.step || s.instruction || `Step ${i + 1}`
      );
    }

    // case: ["text", "text"]
    if (typeof instructions[0] === "string") {
      return instructions;
    }
  }

  // case: single string
  if (typeof instructions === "string") {
    return [instructions];
  }

  return [];
}
