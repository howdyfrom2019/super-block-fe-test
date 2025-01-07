import GameBoard from "@/features/balloon-game/ui/ballon-game-board";

export default function BallonGamePage() {
  return (
    <main
      className={
        "mx-auto flex flex-col items-center gap-4 p-4 w-full max-w-[375px]"
      }
    >
      <header className={"mt-10 mb-4"}>
        <h1 className={"text-2xl font-bold"}>풍선 터뜨리기 게임</h1>
      </header>
      <GameBoard />
    </main>
  );
}
