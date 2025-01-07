import { BALLON_RANDOM_PROBABILITY } from "@/features/balloon-game/lib/utils/ballon-game-config";

export function createBallonGameData(n = 6) {
  return Array(n)
    .fill(null)
    .map(() => createRowElement(n));
}

function createRowElement(n: number) {
  return Array(n)
    .fill(null)
    .map(() => (Math.random() < BALLON_RANDOM_PROBABILITY ? "🎈" : ""));
}
