import { parseAbi, type Address } from "viem";

export const questAbi = parseAbi([
  "function completeQuestForUser(address to, uint256 questId, uint256 points, bytes32 proofHash) external",
  "function claimWithAttestation(address to,uint256 questId,uint256 points,bytes32 proofHash,uint256 deadline,address operator,bytes signature) external",
]);

export const pointsAbi = parseAbi([
  "function mint(address to, uint256 amount) external",
]);
