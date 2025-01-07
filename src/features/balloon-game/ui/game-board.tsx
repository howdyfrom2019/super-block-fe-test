function GameBoard() {
  return (
    <div className={"grid grid-1 bg-gray-100"}>
      {Array(5)
        .fill(null)
        .map(() => (
          <div className={"flex gap-1"}>
            {Array(5)
              .fill(null)
              .map(() => (
                <div className={"size-12"}>ㅁ</div>
              ))}
          </div>
        ))}
    </div>
  );
}

export default GameBoard;
