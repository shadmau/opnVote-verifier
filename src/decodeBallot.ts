/**
 * Ballot Decoder
 *
 * Decoding an opn.vote Ballot
 */
import {
  decryptVotes,
  EncryptionType,
  type EncryptedVotes,
  type EncryptionKey,
  type Vote,
} from "opnvote/votingSystem/dist/index.js";
import * as dotenv from "dotenv";
import type { DecodedBallot, ElectionDescription } from "./types.js";
import {
  validateAndNormalizeHex,
  formatVotes,
  formatElectionDescription,
  prompt,
} from "./utils.js";

dotenv.config();

/**
 * Fetches election description from IPFS
 * @param cid
 * @param gateway - IPFS Gateway, defaults to public ipfs.io
 * @returns Election description data
 */
export async function fetchElectionDescription(
  cid: string,
  gateway?: string
): Promise<ElectionDescription> {
  const ipfsGateway =
    gateway || process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs/";
  const url = `${ipfsGateway}${cid}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `IPFS fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as ElectionDescription;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch election description from IPFS: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Decodes an encrypted ballot
 * @param encryptedVotesHex - Encrypted votes (hex-string)
 * @param electionPrivateKeyHex - Election Priavate Key (hex-string)
 * @param electionDescriptionCID - Optional IPFS CID for election description
 * @returns Decoded ballot with votes and optional election description
 */
export async function decodeBallot(
  encryptedVotesHex: string,
  electionPrivateKeyHex: string,
  electionDescriptionCID?: string
): Promise<DecodedBallot> {
  const encryptedVotes: EncryptedVotes = {
    hexString: encryptedVotesHex,
    encryptionType: EncryptionType.RSA,
  };

  const privateKey: EncryptionKey = {
    hexString: electionPrivateKeyHex,
    encryptionType: EncryptionType.RSA,
  };

  const votes: Vote[] = await decryptVotes(
    encryptedVotes,
    privateKey,
    EncryptionType.RSA
  );

  const result: DecodedBallot = { votes };

  if (electionDescriptionCID) {
    try {
      result.electionDescription = await fetchElectionDescription(
        electionDescriptionCID
      );
    } catch (error) {
      console.error(
        "Warning: Failed to fetch election description:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("=== opnVote Ballot Decoder ===");
  console.log("");

  try {
    const encryptedVotesInput = await prompt(
      "Provide the encrypted votes (hex): "
    );
    const encryptedVotesHex = validateAndNormalizeHex(
      encryptedVotesInput,
      "Encrypted votes"
    );

    const encryptionKeyInput = await prompt(
      "Provide the election private key (hex): "
    );
    const encryptionKeyHex = validateAndNormalizeHex(
      encryptionKeyInput,
      "Election private key"
    );

    const electionCID = await prompt(
      "Provide the election description CID (press Enter to skip): "
    );
    const trimmedCID = electionCID.trim();

    console.log("");
    console.log("Decoding ballot...");
    console.log("");

    const decoded = await decodeBallot(
      encryptedVotesHex,
      encryptionKeyHex,
      trimmedCID || undefined
    );

    console.log("✓ Ballot decoded successfully");
    console.log("");

    if (decoded.electionDescription) {
      console.log("Election Information:");
      console.log("===================");
      console.log(formatElectionDescription(decoded.electionDescription));
      console.log("");
    }

    console.log("Votes:");
    console.log(formatVotes(decoded.votes));
  } catch (error) {
    console.error(
      "✗ Failed to decode ballot:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
