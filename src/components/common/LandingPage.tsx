import React from "react";
import { useHistory } from "react-router-dom";
import { RandomFourCharacterString } from "../../state/RandomFourCharacterString";
import { CenteredColumn } from "./LayoutElements";
import { Button } from "./Button";
import { LongwaveAppTitle } from "./Title";

export function LandingPage() {
  const history = useHistory();
  return (
    <CenteredColumn>
      <LongwaveAppTitle />
      <Button
        text="Szoba létrehozása"
        onClick={() => {
          history.push("/" + RandomFourCharacterString());
        }}
      />
      <p style={{ margin: 8 }}>
        A <strong>Hosszúhullám</strong> egy online, valós időben játszható változata a{" "}
        <em>Hullámhossz</em> nevű társasjátéknak.
      </p>
    </CenteredColumn>
  );
}
