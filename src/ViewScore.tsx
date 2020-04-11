import React from "react";
import { getScore } from "./getScore";
import { Column } from "./LayoutElements";
import { Spectrum } from "./Spectrum";
import { Button } from "./Button";

export function ViewScore(props: {
  spectrumCard: [string, string];
  spectrumTarget: number;
  guess: number;
  nextRound: () => void;
}) {
  const score = getScore(props.spectrumTarget, props.guess);
  return (
    <div>
      <Spectrum
        spectrumCard={props.spectrumCard}
        handleValue={props.guess}
        targetValue={props.spectrumTarget}
      />
      <Column>
        <div>Score: {score} points!</div>
        <div>
          <Button text="Draw next Spectrum Card"
            onClick={props.nextRound}
          />
        </div>
      </Column>
    </div>
  );
}
