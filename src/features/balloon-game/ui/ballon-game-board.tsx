import { createBallonGameData } from "@/features/balloon-game/lib/utils/ballon-game-util";
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
        "size-12 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 ",
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  );
}

function BallonGameBoard() {
  const board = createBallonGameData();
  return (
    <div
      className={
        "grid grid-1 gap-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200/50"
      }
    >
      {board.map((rows) => (
        <div className={"flex gap-1"}>
          {rows.map((col) => (
            <BallonGameCell>{col}</BallonGameCell>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BallonGameBoard;
