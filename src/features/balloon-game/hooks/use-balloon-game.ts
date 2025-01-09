import {
  BALLON_RANDOM_PROBABILITY,
  BALLOON,
} from "@/features/balloon-game/lib/configs/balloon-game-config";
import { useCallback, useEffect, useMemo, useState } from "react";

interface BalloonGameHookProps {
  N: number;
  balloonAppearThresHold?: number;
}

/**
 * @example ```typescript
 * const { gameStatus: { board, isGameOver, balloonLeftForStageClear, adjecentBalloons }, handleBalloonClick, handleCellHover, handleCellHoverEnd, resetGame } = useBalloonGames({
 *   N: 6,
 *   balloonAppearThresHold: 0.6
 * });
 * ```
 * @param param number N - 칸을 N x N 중 어떻게 설정할지 결정.
 * @param balloonAppearThresHold number 0부터 1사이의 확률값. 각 칸은 확률에 맞춰 풍선이 생성됨.
 */
export default function useBalloonGame({
  N,
  balloonAppearThresHold = BALLON_RANDOM_PROBABILITY,
}: BalloonGameHookProps) {
  // 상태관리를 위한 초기화 코드 상단 정의
  const createBallonGameData = useCallback(() => {
    const board = Array(N)
      .fill(null)
      .map(() =>
        Array(N)
          .fill(null)
          .map(() => (Math.random() < balloonAppearThresHold ? "🎈" : ""))
      );
    const count = board.reduce(
      (acc, row) =>
        acc +
        row.reduce((rowsAcc, item) => rowsAcc + (item === BALLOON ? 1 : 0), 0),
      0
    );

    return { board, count };
  }, [N, balloonAppearThresHold]);

  const [gameStatus, setGameStatus] = useState<BalloonGameStatus>(() => {
    const { board, count } = createBallonGameData();

    return {
      board,
      isGameOver: false,
      balloonLeftForStageClear: count,
      adjecentBallons: [],
    };
  });

  const isCompletedGame = useMemo(() => {
    const flat = gameStatus.board.flat(2);
    return flat.filter(Boolean).length === 0;
  }, [gameStatus.board]);

  const findAdjecentBalloons = useCallback(
    ({ startRow, startCol }: { startRow: number; startCol: number }) => {
      const allGroups: Balloon.Position[][] = [];
      const visited = new Set<string>();
      const dr = [-1, 1, 0, 0];
      const dc = [0, 0, -1, 1];

      // 넓이 탐색으로 BFS 채용
      const findGroup = (row: number, col: number): Balloon.Position[] => {
        const key = `${row}-${col}`;
        const positions: Balloon.Position[] = [];
        const groupVisited = new Set<string>([key]);
        const queue: Balloon.Position[] = [{ row, col }];

        while (queue.length > 0) {
          const current = queue.shift()!;
          positions.push(current);

          for (let i = 0; i < dr.length; i++) {
            const nextRow = current.row + dr[i];
            const nextCol = current.col + dc[i];
            const newKey = `${nextRow}-${nextCol}`;

            if (
              nextRow >= 0 &&
              nextRow < N &&
              nextCol >= 0 &&
              nextCol < N &&
              !groupVisited.has(newKey) &&
              gameStatus.board[nextRow][nextCol] === BALLOON
            ) {
              groupVisited.add(newKey);
              queue.push({ row: nextRow, col: nextCol });
            }
          }
        }

        groupVisited.forEach((key) => visited.add(key));
        return positions;
      };

      const currentGroup = findGroup(startRow, startCol);
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          const key = `${row}-${col}`;
          if (gameStatus.board[row][col] === BALLOON && !visited.has(key)) {
            const group = findGroup(row, col);
            allGroups.push(group);
          }
        }
      }

      // 게임 룰 판별을 위해 남은 블록 중 가장 큰 그룹인지 확인
      const isLargest = !allGroups.some(
        (group) => group.length > currentGroup.length
      );

      return { positions: currentGroup, isLargest };
    },
    [gameStatus.board]
  );

  const handleBalloonClick = useCallback(
    ({ row, col }: { row: number; col: number }) => {
      if (gameStatus.isGameOver || gameStatus.board[row][col] !== BALLOON)
        return;

      const { positions, isLargest } = findAdjecentBalloons({
        startRow: row,
        startCol: col,
      });

      if (!isLargest) {
        setGameStatus((prev) => ({ ...prev, isGameOver: true }));
        return;
      }

      const nextBoard = gameStatus.board.map((row) => [...row]);
      positions.forEach(({ row, col }) => {
        nextBoard[row][col] = "";
      });

      setGameStatus((prev) => ({
        ...prev,
        board: nextBoard,
        balloonLeftForStageClear:
          prev.balloonLeftForStageClear - positions.length,
        adjecentBallons: [],
      }));
    },
    [gameStatus, findAdjecentBalloons]
  );

  const handleCellHover = useCallback(
    ({ row, col }: { row: number; col: number }) => {
      if (gameStatus.board[row][col] === BALLOON) {
        const { positions } = findAdjecentBalloons({
          startRow: row,
          startCol: col,
        });
        setGameStatus((prev) => ({
          ...prev,
          adjecentBallons: positions,
        }));
      }
    },
    [gameStatus.board, findAdjecentBalloons]
  );

  const handleCellHoverEnd = useCallback(() => {
    setGameStatus((prev) => ({
      ...prev,
      adjecentBallons: [],
    }));
  }, []);

  const resetGame = useCallback(() => {
    const { board, count } = createBallonGameData();
    setGameStatus({
      board,
      isGameOver: false,
      balloonLeftForStageClear: count,
      adjecentBallons: [],
    });
  }, [createBallonGameData]);

  useEffect(() => {
    const { board, count } = createBallonGameData();
    setGameStatus({
      board,
      isGameOver: false,
      balloonLeftForStageClear: count,
      adjecentBallons: [],
    });
  }, [N, balloonAppearThresHold, createBallonGameData]);

  return {
    gameStatus,
    isCompletedGame,
    /** @deprecated findAdjecentBalloons 테스트 용도용 export */
    findAdjecentBalloons,
    handleBalloonClick,
    handleCellHover,
    handleCellHoverEnd,
    resetGame,
  };
}
