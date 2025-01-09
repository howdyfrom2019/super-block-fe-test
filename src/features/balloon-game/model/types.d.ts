interface BalloonPosition {
  row: number;
  col: number;
}

interface BalloonGameStatus {
  board: ("🎈" | "")[][];
  isGameOver: boolean;
  balloonLeftForStageClear: number;
  adjecentBallons: Position[];
}

declare namespace Balloon {
  type GameStatus = BallonGameStatus;
  type Position = BalloonPosition;
}
