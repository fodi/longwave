import { GameState, InitialGameState, Team } from "../../state/GameState";
import { GameModelContext } from "../../state/GameModelContext";
import { BuildGameModel } from "../../state/BuildGameModel";
import { MakeGuess } from "./MakeGuess";
import React from "react";
import { render } from "@testing-library/react";

const helpText = "Hívj meg más játékosokat is.";
test("Mutatni kell a szöveget, ha több játékosra van szükség", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      player1: {
        name: "Játékos 1",
        team: Team.Left,
      },
    },
    clueGiver: "player1",
  };

  const component = render(
    <GameModelContext.Provider
      value={BuildGameModel(gameState, jest.fn(), "player1")}
    >
      <MakeGuess />
    </GameModelContext.Provider>
  );

  const subject = component.queryByText(helpText);
  expect(subject).toBeInTheDocument();
});

test("Mutatni kell a szöveget, ha több játékosra van szükség", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      player1: {
        name: "Játékos 1",
        team: Team.Left,
      },
      player2: {
        name: "Játékos 2",
        team: Team.Left,
      },
    },
    clueGiver: "player1",
  };

  const component = render(
    <GameModelContext.Provider
      value={BuildGameModel(gameState, jest.fn(), "player1")}
    >
      <MakeGuess />
    </GameModelContext.Provider>
  );

  const subject = component.queryByText(helpText);
  expect(subject).not.toBeInTheDocument();
});

test("A csapat tippjét beküldő gombnak látszania kell", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      player1: {
        name: "Játékos 1",
        team: Team.Left,
      },
      player2: {
        name: "Játékos 2",
        team: Team.Left,
      },
    },
    clueGiver: "player2",
  };

  const component = render(
    <GameModelContext.Provider
      value={BuildGameModel(gameState, jest.fn(), "player1")}
    >
      <MakeGuess />
    </GameModelContext.Provider>
  );

  const subject = component.getByText("A BAL AGYFÉLEKE tippjének beküldése");

  expect(subject).toBeInTheDocument();
});
