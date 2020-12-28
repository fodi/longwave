import React from "react";
import { GameType, RoundPhase } from "../../state/GameState";
import { CenteredRow, CenteredColumn } from "../common/LayoutElements";
import { Button } from "../common/Button";
import { LongwaveAppTitle } from "../common/Title";
import { useContext } from "react";
import { GameModelContext } from "../../state/GameModelContext";
import { NewRound } from "../../state/NewRound";

export function SetupGame() {
  const { gameState, setGameState, localPlayer } = useContext(GameModelContext);

  const startGame = (gameType: GameType) => {
    if (gameType === GameType.Teams) {
      setGameState({
        roundPhase: RoundPhase.PickTeams,
        gameType,
      });
    } else {
      setGameState({
        ...NewRound(localPlayer.id, gameState),
        gameType,
      });
    }
  };

  return (
    <CenteredColumn>
      <LongwaveAppTitle />
      <CenteredRow style={{ flexWrap: "wrap" }}>
        <Button
          text="Csapatjáték legalább 4 fővel"
          onClick={() => startGame(GameType.Teams)}
        />
        <Button
          text="Kooperatív játék legalább 2 fővel"
          onClick={() => startGame(GameType.Cooperative)}
        />
        <Button
          text="Szabadjáték legalább 2 fővel"
          onClick={() => startGame(GameType.Freeplay)}
        />
      </CenteredRow>
    </CenteredColumn>
  );
}
