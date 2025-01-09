type BalloonBoardCell = typeof BALLOON | "";

interface BalloonPosition {
  row: number;
  col: number;
}

interface BalloonGameStatus {
  board: BalloonBoardCell[][];
  isGameOver: boolean;
  balloonLeftForStageClear: number;
  adjecentBallons: Position[];
}

declare namespace Balloon {
  type GameStatus = BallonGameStatus;
  type Position = BalloonPosition;
}
