import useBalloonGame from "@/features/balloon-game/hooks/use-balloon-game";
import { cn } from "@/lib/utils/tailwind-util";
import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

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
  const {
    gameStatus: { board, adjecentBallons, isGameOver },
    handleBalloonClick,
    handleCellHover,
    handleCellHoverEnd,
  } = useBalloonGame({ N: 6 });
  const isHoveringAdjecentBlock = ({
    row,
    col,
  }: {
    row: number;
    col: number;
  }) => {
    return adjecentBallons.some(
      (position) => position.row === row && position.col === col
    );
  };
  return (
    <div
      className={
        "grid grid-1 gap-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200/50"
      }
    >
      {board.map((rows, i) => (
        <div className={"flex gap-1"}>
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
    </div>
  );
}

export default BallonGameBoard;
