import {
  VoteOption,
  isValidHex,
  normalizeHexString,
  type Vote,
} from "opnvote/votingSystem/dist/index.js";
import type { ElectionDescription } from "./types.js";

/**
 * Normalizes hex input
 * @param input - Raw input string
 * @param fieldName - Name of the field for error messages
 * @returns Normalized hex string (0x prefixed)
 */
export function validateAndNormalizeHex(
  input: string,
  fieldName: string
): string {
  if (!input || input.trim() === "") {
    throw new Error(`${fieldName} cannot be empty`);
  }

  const trimmed = input.trim();
  const normalized = normalizeHexString(trimmed);

  if (!isValidHex(normalized, false, false)) {
    throw new Error(`${fieldName} is not a valid hex string`);
  }

  return `0x${normalized}`;
}

/**
 * Formats votes
 */
export function formatVotes(votes: Vote[]): string {
  return votes
    .map((vote, index) => {
      const optionName = VoteOption[vote.value];
      return `  Vote ${index + 1}: ${optionName} (${vote.value})`;
    })
    .join("\n");
}

/**
 * Formats election description
 */
export function formatElectionDescription(
  description: ElectionDescription
): string {
  const lines: string[] = [];

  lines.push(`Title: ${description.title}`);

  if (description.summary) {
    lines.push(`Summary: ${description.summary}`);
  }

  if (description.description) {
    lines.push(`Description: ${description.description}`);
  }

  if (description.headerImage) {
    lines.push(`Header Image: ${description.headerImage.large}`);
  }

  if (description.registrationStartTime && description.registrationEndTime) {
    const startDate = new Date(
      description.registrationStartTime * 1000
    ).toLocaleString();
    const endDate = new Date(
      description.registrationEndTime * 1000
    ).toLocaleString();
    lines.push(`Registration Period: ${startDate} - ${endDate}`);
  }

  if (description.questions && description.questions.length > 0) {
    lines.push("");
    lines.push("Questions:");
    description.questions.forEach((question, index) => {
      lines.push(`  ${index + 1}. ${question.text}`);
      if (question.imageUrl) {
        lines.push(`     Image: ${question.imageUrl}`);
      }
    });
  }

  if (description.backLink) {
    lines.push("");
    lines.push(`Back Link: ${description.backLink}`);
  }

  return lines.join("\n");
}

/**
 * Prompts user for input
 */
export async function prompt(question: string): Promise<string> {
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}
