import React from "react";
import ArgumentOutOfRangeError from "../../common/errors/ArgumentOutOfRangeError";
import FemaleCharacter from "../../core/FemaleCharacter";
import Gender from "../../core/Gender";
import MaleCharacter from "../../core/MaleCharacter";
import CommonCharacterPanel from "./CommonCharacterPanel";
import FemaleInfoPanel from "./FemaleInfoPanel";
import MaleInfoPanel from "./MaleInfoPanel";
import SaveDataPanelProps from "./SaveDataPanelProps";
import SaveDataPanelState from "./SaveDataPanelState";
import {Typography} from "@material-ui/core";

export default class SaveDataPanel extends React.Component<SaveDataPanelProps, SaveDataPanelState> {

    render(): React.ReactNode {
        const data = this.props.data;

        if (data) {
            const saveDataInfo = <div>
                <Typography>
                    School: {data.schoolName}
                </Typography>
            </div>;
            // I didn't use GridList here because it does not meet the requirements here
            const characterList = <div id="character-list" className="f-grid">
                {this.getPanels()}
            </div>;

            return <div>
                {saveDataInfo}
                {characterList}
            </div>;
        } else {
            return <div/>;
        }
    }

    private getPanels(): React.ReactNodeArray {
        const data = this.props.data!;

        const characters = data.characters;
        const characterCount = characters.length;
        const result = new Array<React.ReactNode>(characterCount);

        for (let i = 0; i < characterCount; i += 1) {
            const character = characters[i];
            const key = `${data.schoolName}#${i}@${Date.now().toString(16)}`;

            // Force updating every info panel
            // Note: CommonCharacterPanel (which is responsible for displaying photos) includes its own updating strategy
            switch (character.gender) {
                case Gender.Male:
                    result[i] = <CommonCharacterPanel $={character}>
                        <MaleInfoPanel $={character as MaleCharacter} charaIndex={i} key={key}/>
                    </CommonCharacterPanel>;
                    break;
                case Gender.Female:
                    result[i] = <CommonCharacterPanel $={character}>
                        <FemaleInfoPanel $={character as FemaleCharacter} charaIndex={i} key={key}/>
                    </CommonCharacterPanel>;
                    break;
                default:
                    throw new ArgumentOutOfRangeError(nameof.full(character.gender));
            }
        }

        return result;
    }

}
