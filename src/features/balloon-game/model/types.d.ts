interface BallonGameStatus {
  pos: {
    row: number;
    col: number;
    isGameOver: boolean;
    ballons: number;
  };
}
declare namespace Balloon {
  type GameStatus = BallonGameStatus;
}
