interface BalloonPosition {
  row: number;
  col: number;
}

interface BalloonGameStatus {
  board: ("🎈" | "")[][];
  isGameOver: boolean;
  balloonLeftForStageClear: number;
  adjecentBalloons: {
    isLargest: boolean;
    positions: BalloonPosition[];
  } | null;
}

declare namespace Balloon {
  type GameStatus = BallonGameStatus;
  type Position = BalloonPosition;
}
