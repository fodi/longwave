import React, { useContext } from "react";
import { TeamReverse, TeamName } from "../../state/GameState";
import { Spectrum } from "../common/Spectrum";
import { CenteredColumn, CenteredRow } from "../common/LayoutElements";
import { Button } from "../common/Button";
import { GameModelContext } from "../../state/GameModelContext";
import { ScoreTeamRound } from "../../state/ScoreRound";

export function CounterGuess() {
  const {
    gameState,
    localPlayer,
    clueGiver,
    spectrumCard,
    setGameState,
  } = useContext(GameModelContext);

  if (!clueGiver) {
    return null;
  }

  const notMyTurn = clueGiver.team === localPlayer.team;
  const counterGuessTeamString = TeamName(TeamReverse(clueGiver.team));

  if (notMyTurn) {
    return (
      <div>
        <Spectrum spectrumCard={spectrumCard} guessingValue={gameState.guess} />
        <CenteredColumn>
          <div>
            {clueGiver.name} ezt adta meg: <strong>{gameState.clue}</strong>
          </div>
          <div>Várjuk, hogy a(z) {counterGuessTeamString} csapat tippeljen a bal/jobb irányra...</div>
        </CenteredColumn>
      </div>
    );
  }

  return (
    <div>
      <Spectrum spectrumCard={spectrumCard} guessingValue={gameState.guess} />
      <CenteredColumn>
        <div>
          {clueGiver.name} ezt adta meg: <strong>{gameState.clue}</strong>
        </div>
      </CenteredColumn>
      <CenteredRow>
        <Button
          text="A cél ettől balra található"
          onClick={() =>
            setGameState(ScoreTeamRound(gameState, clueGiver.team, "left"))
          }
        />
        <Button
          text="A cél ettől jobbra található"
          onClick={() =>
            setGameState(ScoreTeamRound(gameState, clueGiver.team, "right"))
          }
        />
      </CenteredRow>
    </div>
  );
}
