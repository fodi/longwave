import React from "react";
import { RoundPhase, GameType, Team } from "../state/AppState";
import { GiveClue } from "./GiveClue";
import { MakeGuess } from "./MakeGuess";
import { ViewScore } from "./ViewScore";
import { JoinTeam } from "./JoinTeam";
import { Scoreboard } from "./Scoreboard";
import { SetupGame } from "./SetupGame";
import { CounterGuess } from "./CounterGuess";
import { useContext } from "react";
import { GameModelContext } from "../state/GameModelContext";

export function ActiveGame() {
  const { state: gameState, localPlayer } = useContext(GameModelContext);

  if (gameState.roundPhase === RoundPhase.SetupGame) {
    return <SetupGame />;
  }

  if (
    gameState.gameType === GameType.Teams &&
    (gameState.roundPhase === RoundPhase.PickTeams ||
      localPlayer.team === Team.Unset)
  ) {
    return <JoinTeam />;
  }

  return (
    <>
      {gameState.roundPhase === RoundPhase.GiveClue && <GiveClue />}
      {gameState.roundPhase === RoundPhase.MakeGuess && <MakeGuess />}
      {gameState.roundPhase === RoundPhase.CounterGuess && <CounterGuess />}
      {gameState.roundPhase === RoundPhase.ViewScore && <ViewScore />}
      <Scoreboard />
    </>
  );
}