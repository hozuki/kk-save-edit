import {Grid, TextField} from "@material-ui/core";
import React, {ChangeEvent} from "react";
import FieldValidator from "./FieldValidator";
import MaleInfoPanelProps from "./MaleInfoPanelProps";
import MaleInfoPanelState from "./MaleInfoPanelState";

export default class MaleInfoPanel extends React.Component<MaleInfoPanelProps, MaleInfoPanelState> {

    constructor(props: MaleInfoPanelProps) {
        super(props);

        this._onTextChange = this.onTextChange.bind(this);
    }

    render(): React.ReactNode {
        const $ = this.props.$;
        const errors = this.state.errors;

        return <Grid container direction="column" justify="flex-start" alignItems="flex-start">
            <Grid item>
                <TextField label="Family Name"
                           defaultValue={$.lastName} placeholder={$.lastName}
                           onChange={e => this._onTextChange(nameof(this.state.errors.lastName), e)}
                           error={!!errors.lastName} helperText={errors.lastName}/>
            </Grid>
            <Grid item>
                <TextField label="Given Name"
                           defaultValue={$.firstName} placeholder={$.firstName}
                           onChange={e => this._onTextChange(nameof(this.state.errors.firstName), e)}
                           error={!!errors.firstName} helperText={errors.firstName}/>
            </Grid>
            <Grid item>
                <TextField label="Nickname"
                           defaultValue={$.nickname} placeholder={$.nickname}
                           onChange={e => this._onTextChange(nameof(this.state.errors.nickname), e)}
                           error={!!errors.nickname} helperText={errors.nickname}/>
            </Grid>
            <Grid item>
                <TextField label="Intellect"
                           defaultValue={$.intelligence} placeholder={"0"}
                           onChange={e => this._onTextChange(nameof(this.state.errors.intelligence), e)}
                           error={!!errors.intelligence} helperText={errors.intelligence}/>
            </Grid>
            <Grid item>
                <TextField label="Strength"
                           defaultValue={$.strength} placeholder={"0"}
                           onChange={e => this._onTextChange(nameof(this.state.errors.strength), e)}
                           error={!!errors.strength} helperText={errors.strength}/>
            </Grid>
            <Grid item>
                <TextField label="H"
                           defaultValue={$.hentai} placeholder={"0"}
                           onChange={e => this._onTextChange(nameof(this.state.errors.hentai), e)}
                           error={!!errors.hentai} helperText={errors.hentai}/>
            </Grid>
        </Grid>;
    }

    readonly state: MaleInfoPanelState = {
        values: Object.create(null),
        errors: Object.create(null),
    };

    private onTextChange(fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const values = this.state.values;
        values[fieldName] = event.target.value;

        this.validateAndSetFields();
    }

    private validateAndSetFields(): void {
        const $ = this.props.$;
        const values = this.state.values;
        const errors = this.state.errors;

        FieldValidator.validateString(values, errors, nameof(values.lastName), value => $.lastName = value);
        FieldValidator.validateString(values, errors, nameof(values.firstName), value => $.firstName = value);
        FieldValidator.validateString(values, errors, nameof(values.nickname), value => $.nickname = value);
        FieldValidator.validateInt(values, errors, nameof(values.intelligence), 0, 100, value => $.intelligence = value);
        FieldValidator.validateInt(values, errors, nameof(values.strength), 0, 100, value => $.strength = value);
        FieldValidator.validateInt(values, errors, nameof(values.hentai), 0, 100, value => $.hentai = value);

        this.setState({
            values,
            errors
        });
    }

    private readonly _onTextChange: (fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}
