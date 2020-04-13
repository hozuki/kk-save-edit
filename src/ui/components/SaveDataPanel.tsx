import {TextField} from "@material-ui/core";
import React, {ChangeEvent} from "react";
import ArgumentOutOfRangeError from "../../common/errors/ArgumentOutOfRangeError";
import FemaleCharacter from "../../core/FemaleCharacter";
import Gender from "../../core/Gender";
import MaleCharacter from "../../core/MaleCharacter";
import CommonCharacterPanel from "./CommonCharacterPanel";
import FemaleInfoPanel from "./FemaleInfoPanel";
import FieldValidator from "./FieldValidator";
import MaleInfoPanel from "./MaleInfoPanel";
import SaveDataPanelProps from "./SaveDataPanelProps";
import SaveDataPanelState from "./SaveDataPanelState";

export default class SaveDataPanel extends React.Component<SaveDataPanelProps, SaveDataPanelState> {

    constructor(props: SaveDataPanelProps) {
        super(props);

        this._onTextChange = this.onTextChange.bind(this);
    }

    render(): React.ReactNode {
        const data = this.props.data;
        const errors = this.state.errors;

        if (data) {
            const saveDataInfo = <div>
                <TextField label="School name"
                           defaultValue={data.schoolName} placeholder={data.schoolName}
                           onChange={e => this._onTextChange(nameof(this.state.errors.schoolName), e)}
                           error={!!errors.schoolName} helperText={errors.schoolName}/>
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

    readonly state: SaveDataPanelState = {
        values: Object.create(null),
        errors: Object.create(null),
    };

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

    private onTextChange(fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const values = this.state.values;
        values[fieldName] = event.target.value;

        this.validateAndSetFields();
    }

    private validateAndSetFields(): void {
        const data = this.props.data!;
        const values = this.state.values;
        const errors = this.state.errors;

        FieldValidator.validateString(values, errors, nameof(values.schoolName), value => data.schoolName = value);

        this.setState({
            values,
            errors
        });
    }

    private readonly _onTextChange: (fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}
