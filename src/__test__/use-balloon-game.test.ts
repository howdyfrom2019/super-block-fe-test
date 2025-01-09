import useBalloonGame from "@/features/balloon-game/hooks/use-balloon-game";
import { BASIC_BALLOON_BOARD_N } from "@/features/balloon-game/lib/configs/balloon-game-config";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("[훅 테스트] @/features/balloon-game/hooks/use-balloon-game", () => {
  it("훅의 리턴값 gameStatus.board의 타입은 🎈과 (빈칸) 중 하나이다", () => {
    function isValidCell(test: any): test is Balloon.GameStatus["board"] {
      return test.every((rows: string[]) =>
        rows.every((el) => ["🎈", ""].includes(el))
      );
    }

    const { result } = renderHook(() =>
      useBalloonGame({ N: BASIC_BALLOON_BOARD_N })
    );
    const board = result.current.gameStatus.board;

    let isValidType = false;
    if (isValidCell(board)) {
      isValidType = true;
    }
    expect(isValidType).toBe(true);
  });

  it("가장 크게 인접해 있는 블록을 클릭하면 해당 영역과 인접 영역이 (빈칸)으로 바뀌어야한다.", async () => {
    const { result } = renderHook(() =>
      useBalloonGame({ N: BASIC_BALLOON_BOARD_N })
    );
    const { findAdjecentBalloons, handleBalloonClick } = result.current;
    const initialCount = result.current.gameStatus.balloonLeftForStageClear;
    let [row, col] = [0, 0];

    await findLargestArea();
    await act(async () => handleBalloonClick({ row, col }));

    await waitFor(() =>
      expect(result.current.gameStatus.balloonLeftForStageClear).toBeLessThan(
        initialCount
      )
    );

    async function findLargestArea() {
      for (let i = 0; i < BASIC_BALLOON_BOARD_N; i++) {
        for (let j = 0; j < BASIC_BALLOON_BOARD_N; j++) {
          const { isLargest } = await act(async () =>
            findAdjecentBalloons({
              startRow: i,
              startCol: j,
            })
          );
          if (isLargest) {
            [row, col] = [i, j];
            return;
          }
        }
      }
    }
  });

  it("게임이 초기화되면 모든 상태값이 리셋되어야 한다.", async () => {
    const { result } = renderHook(() =>
      useBalloonGame({ N: BASIC_BALLOON_BOARD_N })
    );
    const { resetGame, gameStatus } = result.current;

    const initialBalloonCount = gameStatus.balloonLeftForStageClear;

    await act(async () => {
      resetGame();
    });

    await waitFor(() => {
      expect(gameStatus.balloonLeftForStageClear).toBe(initialBalloonCount);
      expect(gameStatus.isGameOver).toBe(false);
    });
  });

  it("게임 오버 상태에서 풍선을 클릭해도 상태가 변화하지 않아야 한다.", async () => {
    const { result } = renderHook(() =>
      useBalloonGame({ N: BASIC_BALLOON_BOARD_N })
    );
    const { handleBalloonClick, gameStatus, resetGame } = result.current;

    await act(async () => {
      handleBalloonClick({ row: 0, col: 0 }); // 임의의 좌표
    });

    await waitFor(() => {
      expect(gameStatus.isGameOver).toBe(false);
    });

    await act(async () => {
      resetGame();
      handleBalloonClick({ row: 0, col: 0 });
    });
    await waitFor(() => {
      expect(gameStatus.isGameOver).toBe(false);
    });
  });
});
