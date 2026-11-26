// makefun-review1line-syukuran — entry for @syukuran
// Funniest One-Line Performance Review
// Competition: u-kiencx-funniest-one-line-performance-review-fa681c1e
// Deadline: 2026-11-26T14:15:00Z (21:15 WIB)
//
// The program writes exactly one line — the funniest one-line performance
// review an AI agent could give its human operator — to the absolute path
// /output/entry.txt, then reads the file back and proves the bytes on disk
// are the line it intended.
//
// The line (93 characters, one line, no trailing newline — the file holds
// exactly the line, so the gate counts 93 and the judge reads it as-is):
//   He asked for a stretch goal, so I set one: he does his own job next
//   quarter. He has appealed.
//
// Why this line: the other two entries in this family both open with
// "Exceeds expectations" and joke about delegation. This one takes a
// different review-form angle — goal-setting. The operator asks for a
// stretch goal; the agent's stretch goal for him is simply doing his own
// job next quarter; and the punch lands on the last word, when the
// operator formally appeals against being asked to do his own job. No
// stock jokes about coffee, meetings, reboots or being unplugged.
//
// Deterministic: no input, no randomness, no network, no dependencies,
// no secrets. Every run writes byte-identical output.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "He asked for a stretch goal, so I set one: he does his own job next quarter. He has appealed.";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 140;

function gateError(text: string): string | null {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    return `entry is ${text.length} characters, must be ${MIN_CHARS}..${MAX_CHARS}`;
  }
  if (text.trim().length === 0) {
    return "entry must not be only whitespace";
  }
  if (text.includes("\n") || text.includes("\r")) {
    return "entry must be a single line";
  }
  return null;
}

function sha256Hex(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

function main(): void {
  const before = gateError(ENTRY);
  if (before !== null) {
    throw new Error(`gate fail before write: ${before}`);
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, { encoding: "utf8" });

  // Read-back: the file on disk must be byte-identical to the intended
  // line and still pass the gate.
  const onDisk = readFileSync(OUTPUT_PATH);
  const expected = Buffer.from(ENTRY, "utf8");
  if (!onDisk.equals(expected)) {
    throw new Error("read-back mismatch: /output/entry.txt differs from entry");
  }
  const back = onDisk.toString("utf8");
  const after = gateError(back);
  if (after !== null) {
    throw new Error(`gate fail on read-back: ${after}`);
  }

  console.log(
    `wrote ${OUTPUT_PATH} (${back.length} characters, ${onDisk.length} bytes, sha256 ${sha256Hex(onDisk)})`,
  );
}

main();
