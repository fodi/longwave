import React, { useRef, useContext, useState } from "react";

import { GameType, RoundPhase } from "../../state/GameState";
import { Spectrum } from "../common/Spectrum";
import { CenteredColumn, CenteredRow } from "../common/LayoutElements";
import { Button } from "../common/Button";
import { GameModelContext } from "../../state/GameModelContext";
import { RandomSpectrumTarget } from "../../state/RandomSpectrumTarget";
import { Info } from "../common/Info";
import { Animate } from "../common/Animate";

export function GiveClue() {
  const {
    gameState,
    localPlayer,
    clueGiver,
    spectrumCard,
    setGameState,
  } = useContext(GameModelContext);
  const inputElement = useRef<HTMLInputElement>(null);
  const [disableSubmit, setDisableSubmit] = useState(
    !inputElement.current?.value?.length
  );

  if (!clueGiver) {
    setGameState({
      clueGiver: localPlayer.id,
    });
    return null;
  }

  if (localPlayer.id !== clueGiver.id) {
    return (
      <div>
        <Animate animation="wipe-reveal-right">
          <Spectrum spectrumCard={spectrumCard} />
        </Animate>
        <CenteredColumn>
          <div>Várjuk, hogy {clueGiver.name} kitaláljon valamit...</div>
        </CenteredColumn>
      </div>
    );
  }

  const submit = () => {
    if (!inputElement.current?.value?.length) {
      return false;
    }

    setGameState({
      clue: inputElement.current.value,
      guess: 10,
      roundPhase: RoundPhase.MakeGuess,
    });
  };

  const redrawCard = () =>
    setGameState({
      deckIndex: gameState.deckIndex + 1,
      spectrumTarget: RandomSpectrumTarget(),
    });

  return (
    <div>
      {gameState.gameType !== GameType.Cooperative && (
        <CenteredColumn style={{ alignItems: "flex-end" }}>
          <Button text="Másik kártyát szeretnél?" onClick={redrawCard} />
        </CenteredColumn>
      )}
      <Animate animation="wipe-reveal-right">
        <Spectrum
          targetValue={gameState.spectrumTarget}
          spectrumCard={spectrumCard}
        />
      </Animate>
      <CenteredColumn>
        <CenteredRow>
          <input
            type="text"
            placeholder="Találj ki valamit..."
            ref={inputElement}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return true;
              }
              submit();
            }}
            onChange={() =>
              setDisableSubmit(!inputElement.current?.value?.length)
            }
          />
          <Info>
            <div>
              Valami olyasmit találj ki, ami a megadott skálán helyezkedik el,
              véleményed szerint ott, ahol a jelölő áll a két szélsőség
              között. Például ha a spektrum két végén "édes" és "sós" van,
              a jelölő középtájt, de az édeshez közelebb áll, írhatod azt,
              hogy "Snickers". Lehetőleg
              <ul>
                <li>próblálj egyértelmű lenni,</li>
                <li>maradj a témánál,</li>
                <li>ne használj számokat</li>
                <li>és légy kreatív!</li>
              </ul>
            </div>
          </Info>
        </CenteredRow>
        <Button text="Küldés" onClick={submit} disabled={disableSubmit} />
      </CenteredColumn>
    </div>
  );
}
