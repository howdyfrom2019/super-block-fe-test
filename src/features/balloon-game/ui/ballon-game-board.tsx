import { Button } from "@/components/ui/button";
import useBalloonGame from "@/features/balloon-game/hooks/use-balloon-game";
import {
  BALLON_RANDOM_PROBABILITY,
  BASIC_BALLOON_BOARD_N,
} from "@/features/balloon-game/lib/configs/balloon-game-config";
import { cn } from "@/lib/utils/tailwind-util";
import { ComponentPropsWithoutRef, PropsWithChildren, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

interface BalloonGameCellProps extends ComponentPropsWithoutRef<"button"> {}

function BallonGameCell({
  className,
  children,
  ...props
}: PropsWithChildren<BalloonGameCellProps>) {
  return (
    <button
      className={cn([
        "size-12 flex items-center justify-center rounded-lg disabled:opacity-50 ",
        "transition-all duration-200",
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  );
}

function BallonGameBoard() {
  const [stage, setStage] = useState(1);
  const {
    gameStatus: { board, adjecentBalloons, isGameOver },
    isCompletedGame,
    handleBalloonClick,
    handleCellHover,
    handleCellHoverEnd,
    resetGame,
  } = useBalloonGame({
    N: Math.floor(BASIC_BALLOON_BOARD_N + stage),
    balloonAppearThresHold:
      BALLON_RANDOM_PROBABILITY / ((stage - 1) * 0.618 || 1),
  });
  const isHoveringAdjecentBlock = ({
    row,
    col,
  }: {
    row: number;
    col: number;
  }) => {
    return adjecentBalloons?.positions.some(
      (position) => position.row === row && position.col === col
    );
  };
  return (
    <div className={"flex flex-col gap-2 items-center"}>
      <div className={"flex items-center gap-2 justify-between w-full"}>
        <h2 className={"text-xl font-semibold"}>
          스테이지 {stage.toLocaleString("en-US")}
        </h2>
        <Button
          disabled={stage === 1}
          className={"text-white"}
          onClick={(e) => {
            e.preventDefault();
            setStage(1);
            resetGame();
          }}
        >
          스테이지 초기화
        </Button>
      </div>
      <div
        className={
          "relative grid grid-1 gap-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200/50"
        }
      >
        {board.map((rows, i) => (
          <div className={"flex gap-1"} key={i}>
            {rows.map((col, j) => (
              <BallonGameCell
                disabled={isGameOver}
                className={cn([
                  isHoveringAdjecentBlock({ row: i, col: j })
                    ? "bg-blue-100"
                    : "bg-white hover:bg-gray-50",
                  isGameOver && "opacity-50",
                ])}
                onClick={(e) => {
                  e.preventDefault();
                  handleBalloonClick({ row: i, col: j });
                }}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  handleCellHover({ row: i, col: j });
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  handleCellHoverEnd();
                }}
                key={`${i}-${j}`}
              >
                {col}
              </BallonGameCell>
            ))}
          </div>
        ))}
        {isGameOver && (
          <aside
            className={
              "backdrop-blur-md absolute inset-0 w-full h-full flex flex-col gap-2 items-center justify-center"
            }
          >
            <p className={"font-semibold"}>클리어 실패</p>
            <small className={"text-zinc-400 text-xs"}>
              Tip. 가장 큰 블록부터 터뜨려보세요.
            </small>
            <Button
              className={"text-white"}
              onClick={(e) => {
                e.preventDefault();
                resetGame();
              }}
            >
              <svg
                className={"fill-white"}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                aria-labelledby="title"
                aria-describedby="desc"
                role="img"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <title>Retry</title>
                <desc>A solid styled icon from Orion Icon Library.</desc>
                <path
                  data-name="layer1"
                  d="M3.307 22.023a3 3 0 0 1 4.17.784l2.476 3.622A27.067 27.067 0 0 1 36 6c14.557 0 26 12.036 26 26.584a26.395 26.395 0 0 1-45.066 18.678 3 3 0 1 1 4.244-4.242A20.395 20.395 0 0 0 56 32.584C56 21.344 47.248 12 36 12a21.045 21.045 0 0 0-20.257 16.059l4.314-3.968a3 3 0 0 1 4.062 4.418l-9.737 8.952c-.013.013-.03.02-.043.033-.067.06-.143.11-.215.163a2.751 2.751 0 0 1-.243.17c-.076.046-.159.082-.24.12a3.023 3.023 0 0 1-.279.123c-.08.03-.163.05-.246.071a3.045 3.045 0 0 1-.323.07c-.034.006-.065.017-.1.022-.051.006-.102-.002-.154.002-.063.004-.124.017-.187.017-.07 0-.141-.007-.212-.012l-.08-.004-.05-.003c-.06-.007-.118-.03-.178-.04a3.119 3.119 0 0 1-.388-.087c-.083-.027-.16-.064-.239-.097a2.899 2.899 0 0 1-.314-.146 2.753 2.753 0 0 1-.233-.151 2.807 2.807 0 0 1-.262-.2 2.857 2.857 0 0 1-.2-.19 3.013 3.013 0 0 1-.224-.262c-.03-.04-.069-.073-.097-.114L2.523 26.194a3.001 3.001 0 0 1 .784-4.17z"
                  fill="current"
                ></path>
              </svg>
              다시 해보기
            </Button>
          </aside>
        )}
      </div>
      {isCompletedGame && (
        <>
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={80}
            width={525}
          />
          <div className={"flex flex-col items-center"}>
            <p className={"font-semibold"}>축하합니다🎉</p>
            <p className={"text-zinc-600 text-sm"}>
              조금 더 어려운 난이도로 해볼까요?
            </p>
            <div
              className={
                "flex items-center flex-col w-full gap-2 mt-3 text-white"
              }
            >
              <Button
                className={"w-full"}
                onClick={() => {
                  resetGame();
                }}
              >
                현재 난이도로 계속하기
              </Button>
              <Button
                className={"w-full"}
                onClick={() => {
                  setStage((prev) => prev + 1);
                  resetGame();
                }}
              >
                난이도 높히기
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BallonGameBoard;
