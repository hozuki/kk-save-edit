import React, {ChangeEvent} from "react";
import MaleInfoPanelProps from "./MaleInfoPanelProps";
import MaleInfoPanelState from "./MaleInfoPanelState";
import {Grid, TextField} from "@material-ui/core";
import Guard from "../../common/Guard";
import Utf8String from "../../core/util/Utf8String";
import ValidationRE from "../ValidationRE";

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

        validateString(nameof(values.lastName), value => $.lastName = value);
        validateString(nameof(values.firstName), value => $.firstName = value);
        validateString(nameof(values.nickname), value => $.nickname = value);
        validateInt(nameof(values.intelligence), 0, 100, value => $.intelligence = value);
        validateInt(nameof(values.strength), 0, 100, value => $.strength = value);
        validateInt(nameof(values.hentai), 0, 100, value => $.hentai = value);

        this.setState({
            values,
            errors
        });

        function validateString(key: string, setValueCallback: (value: string) => void): boolean {
            const v = values[key];
            let ok = true;

            if (Guard.defined(v)) {
                if (v.length > 0) {
                    const bytes = Utf8String.toBytes(v!);

                    if (bytes.length > 0xff) {
                        errors[key] = "String is too long";
                        ok = false;
                    }
                }

                if (ok) {
                    errors[key] = "";
                    setValueCallback(v);
                }
            } else {
                ok = false;
            }

            return ok;
        }

        function validateInt(key: string, min: number, max: number, setValueCallback: (value: number) => void): boolean {
            const v = values[key];
            let ok = true;

            if (Guard.defined(v)) {
                if (ValidationRE.positiveInteger.test(v)) {
                    const n = Number.parseInt(v);

                    if (n < min || n > max) {
                        errors[key] = `Should be between ${min} and ${max}`;
                        ok = false;
                    }
                } else {
                    errors[key] = "Should be an integer";
                    ok = false;
                }

                if (ok) {
                    errors[key] = "";
                    setValueCallback(Number.parseInt(v));
                }
            } else {
                ok = false;
            }

            return ok;
        }
    }

    private readonly _onTextChange: (fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}
