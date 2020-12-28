import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import { GameModelContext } from "../../state/GameModelContext";
import { BuildGameModel } from "../../state/BuildGameModel";
import { InitialGameState, GameState, Team } from "../../state/GameState";
import { JoinTeam } from "./JoinTeam";

jest.useFakeTimers();

test("Játékos hozzárendelése a kiválasztott csapathoz", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      playerId: {
        name: "Játékos",
        team: Team.Unset,
      },
    },
  };

  const setState = jest.fn();
  const component = render(
    <GameModelContext.Provider
      value={BuildGameModel(gameState, setState, "playerId")}
    >
      <JoinTeam />
    </GameModelContext.Provider>
  );

  const button = component
    .getByText("BAL AGYFÉLTEKE")
    .parentNode?.querySelector("input")!;
  expect(button.value).toEqual("Csatlakozás");
  fireEvent.click(button);

  expect(setState).toHaveBeenCalledWith({
    players: {
      playerId: {
        id: "playerId",
        name: "Játékos",
        team: Team.Left,
      },
    },
  });
});

test("Shows current team members", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      playerId: {
        name: "Játékos",
        team: Team.Unset,
      },
      leftTeam1: {
        name: "Bal csapat 1",
        team: Team.Left,
      },
      leftTeam2: {
        name: "Bal csapat 2",
        team: Team.Left,
      },
      rightTeam1: {
        name: "Jobb csapat 1",
        team: Team.Right,
      },
      rightTeam2: {
        name: "Jobb csapat 2",
        team: Team.Right,
      },
    },
  };

  const component = render(
    <GameModelContext.Provider
      value={BuildGameModel(gameState, jest.fn(), "playerId")}
    >
      <JoinTeam />
    </GameModelContext.Provider>
  );

  const leftBrain = within(component.getByText("BAL AGYFÉLTEKE").parentElement!);
  expect(leftBrain.getByText("Bal csapat 1")).toBeInTheDocument();
  expect(leftBrain.getByText("Bal csapat 2")).toBeInTheDocument();

  const rightBrain = within(component.getByText("JOBB AGYFÉLTEKE").parentElement!);
  expect(rightBrain.getByText("Jobb csapat 1")).toBeInTheDocument();
  expect(rightBrain.getByText("Jobb csapat 2")).toBeInTheDocument();
});
