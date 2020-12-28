import React, { useContext } from "react";
import { GetScore } from "../../state/GetScore";
import { CenteredColumn, CenteredRow } from "../common/LayoutElements";
import { Spectrum } from "../common/Spectrum";
import { Button } from "../common/Button";
import {
  GameType,
  Team,
  InitialGameState,
  TeamName,
  TeamReverse,
} from "../../state/GameState";
import { GameModelContext } from "../../state/GameModelContext";
import { NewRound } from "../../state/NewRound";
import { Info } from "../common/Info";

export function ViewScore() {
  const { gameState, clueGiver, spectrumCard } = useContext(GameModelContext);

  if (!clueGiver) {
    return null;
  }

  let score = GetScore(gameState.spectrumTarget, gameState.guess);
  let bonusCoopTurn = false;
  if (gameState.gameType === GameType.Cooperative && score === 4) {
    score = 3;
    bonusCoopTurn = true;
  }

  const wasCounterGuessCorrect =
    (gameState.counterGuess === "left" &&
      gameState.spectrumTarget < gameState.guess) ||
    (gameState.counterGuess === "right" &&
      gameState.spectrumTarget > gameState.guess);

  return (
    <div>
      <Spectrum
        spectrumCard={spectrumCard}
        handleValue={gameState.guess}
        targetValue={gameState.spectrumTarget}
      />
      <CenteredColumn>
        <div>
          {clueGiver.name} ezt adta meg: <strong>{gameState.clue}</strong>
        </div>
        <div>A tippért {score} pont jár.</div>
        {gameState.gameType === GameType.Teams && (
          <div>
            A(z) {TeamName(TeamReverse(clueGiver.team))} csapat
            {wasCounterGuessCorrect
              ? " kap egy bónusz pontot."
              : " nem kap bónusz pontot."}
          </div>
        )}
        {bonusCoopTurn && (
          <div>
            A csapatod kap egy <strong>bónusz kört!</strong>
          </div>
        )}
        <NextTurnOrEndGame />
      </CenteredColumn>
    </div>
  );
}

function NextTurnOrEndGame() {
  const { gameState, localPlayer, clueGiver, setGameState } = useContext(
    GameModelContext
  );

  if (!clueGiver) {
    return null;
  }

  const resetButton = (
    <Button
      text="Játék újraindítása"
      onClick={() => {
        setGameState({
          ...InitialGameState(),
          deckSeed: gameState.deckSeed,
          deckIndex: gameState.deckIndex,
        });
      }}
    />
  );

  if (gameState.leftScore >= 10 && gameState.leftScore > gameState.rightScore) {
    return (
      <>
        <div>A nyertes csapat: {TeamName(Team.Left)}</div>
        {resetButton}
      </>
    );
  }

  if (
    gameState.rightScore >= 10 &&
    gameState.rightScore > gameState.leftScore
  ) {
    return (
      <>
        <div>A nyertes csapat: {TeamName(Team.Right)}</div>
        {resetButton}
      </>
    );
  }

  if (
    gameState.gameType === GameType.Cooperative &&
    gameState.turnsTaken >= 7 + gameState.coopBonusTurns
  ) {
    return (
      <>
        <div>Vége a játéknkak</div>
        <div>
          A csapatod kooperatív végeredménye:{" "}
          <strong>{gameState.coopScore} pont</strong>
        </div>
        {resetButton}
      </>
    );
  }

  const score = GetScore(gameState.spectrumTarget, gameState.guess);

  const scoringTeamString = TeamName(clueGiver.team);

  let bonusTurn = false;

  const nextTeam = (() => {
    if (gameState.gameType !== GameType.Teams) {
      return Team.Unset;
    }

    if (score === 4) {
      if (
        gameState.leftScore < gameState.rightScore &&
        clueGiver.team === Team.Left
      ) {
        bonusTurn = true;
        return Team.Left;
      }
      if (
        gameState.rightScore < gameState.leftScore &&
        clueGiver.team === Team.Right
      ) {
        bonusTurn = true;
        return Team.Right;
      }
    }

    return TeamReverse(clueGiver.team);
  })();

  const eligibleToDraw = (() => {
    if (clueGiver.id === localPlayer.id) {
      return false;
    }

    if (gameState.gameType !== GameType.Teams) {
      return true;
    }

    return localPlayer.team === nextTeam;
  })();

  return (
    <>
      {bonusTurn && (
        <CenteredRow>
          <div>A(z) {scoringTeamString} csapat bónusz körben részesül! </div>
          <Info>
            Ha a vesztésre álló csapat egy körben négy pontot szerez,
            bónusz kört nyer, hogy behozza lemaradását.
          </Info>
        </CenteredRow>
      )}
      {eligibleToDraw && (
        <Button
          text="Következő kártya"
          onClick={() => setGameState(NewRound(localPlayer.id, gameState))}
        />
      )}
    </>
  );
}
