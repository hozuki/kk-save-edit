import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import React, {ChangeEvent} from "react";
import FreeDict from "../../common/FreeDict";
import Guard from "../../common/Guard";
import Nullable from "../../common/types/Nullable";
import PropBag from "../../core/PropBag";
import KnownPercentageKey from "../../core/internal/known/KnownPercentageKey";
import Enumerable from "../../core/util/Enumerable";
import Utf8String from "../../core/util/Utf8String";
import ValidationRE from "../ValidationRE";
import * as lang from "../lang/default.lang.json";
import FemaleInfoPanelProps from "./FemaleInfoPanelProps";
import FemaleInfoPanelState from "./FemaleInfoPanelState";

export default class FemaleInfoPanel extends React.Component<FemaleInfoPanelProps, FemaleInfoPanelState> {

    constructor(props: FemaleInfoPanelProps) {
        super(props);

        this._onTextChange = this.onTextChange.bind(this);
        this._onSelectionChange = this.onSelectionChange.bind(this);
        this._onCheckedChange = this.onCheckedChange.bind(this);
    }

    render(): React.ReactNode {
        const $ = this.props.$;
        const errors = this.state.errors;

        return <Grid container direction="column">
            <Grid container item direction="row" justify="flex-start" alignItems="flex-start">
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
                    {this.getSelections("Personality", lang.map.personalities, $.personality, nameof(errors.personality))}
                </Grid>
                <Grid item>
                    {this.getSelections("Weak Point", lang.map.weakPoints, $.weakPoint, nameof(errors.weakPoint))}
                </Grid>
            </Grid>
            <Grid item>
                {this.getCheckBoxes("Answers", lang.map.answers, $.answers, nameof(errors.answers))}
            </Grid>
            <Grid item>
                {this.getCheckBoxes("Intercourse Preferences", lang.map.sexPrefs, $.sexPrefs, nameof(errors.sexPrefs))}
            </Grid>
            <Grid item>
                {this.getCheckBoxes("Traits", lang.map.traits, $.traits, nameof(errors.traits))}
            </Grid>
            <Grid container item direction="row">
                <Grid item>
                    <TextField label="Feeling"
                               defaultValue={$.feeling} placeholder={"0"}
                               onChange={e => this._onTextChange(nameof(errors.feeling), e)}
                               error={!!errors.feeling} helperText={errors.feeling}/>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={$.isLover}
                                           onChange={(e, checked) => this._onCheckedChange(nameof(errors.isLover), null, e, checked)}/>}
                        label="Is lover"/>
                </Grid>
                <Grid item>
                    <TextField label="H Degree"
                               defaultValue={$.eroticDegree} placeholder={"0"}
                               onChange={e => this._onTextChange(nameof(errors.hDegree), e)}
                               error={!!errors.hDegree} helperText={errors.hDegree}/>
                </Grid>
                <Grid item>
                    <TextField label="H Count"
                               defaultValue={$.hCount} placeholder={"0"}
                               onChange={e => this._onTextChange(nameof(errors.hCount), e)}
                               error={!!errors.hCount} helperText={errors.hCount}/>
                </Grid>
                <Grid item>
                    <TextField label="Intimacy"
                               defaultValue={$.intimacy} placeholder={"0"}
                               onChange={e => this._onTextChange(nameof(errors.intimacy), e)}
                               error={!!errors.intimacy} helperText={errors.intimacy}/>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={$.isAngry}
                                           onChange={(e, checked) => this._onCheckedChange(nameof(errors.isAngry), null, e, checked)}/>}
                        label="Is angry"/>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={$.isClubMember}
                                           onChange={(e, checked) => this._onCheckedChange(nameof(errors.isClubMember), null, e, checked)}/>}
                        label="Is Koikatu club member"/>
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox checked={$.hasDate}
                                           onChange={(e, checked) => this._onCheckedChange(nameof(errors.hasDate), null, e, checked)}/>}
                        label="On a date"/>
                </Grid>
            </Grid>
            <Grid container item direction="row">
                {this.getPercentages()}
            </Grid>
        </Grid>;
    }

    readonly state: FemaleInfoPanelState = {
        values: Object.create(null),
        errors: Object.create(null),
    };

    private getSelections(label: string, texts: string[], value: number, fieldName: string): React.ReactNode {
        const items = texts.map((text, i) => <MenuItem value={i}>{text}</MenuItem>);
        const onChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>, c: React.ReactNode) =>
            this._onSelectionChange(fieldName, null, e, c);

        const selectId = `${this.props.charaIndex}_${fieldName}`;
        const labelId = `label-${selectId}`;

        return [
            <InputLabel id={labelId}>
                {label}
            </InputLabel>,
            <Select labelId={labelId} id={selectId} value={value}
                    onChange={onChange}>
                {items}
            </Select>
        ];
    }

    private getCheckBoxes(label: string, descriptions: FreeDict<string>, bag: PropBag<boolean>, fieldName: string): React.ReactNode {
        const props = bag.getProps();
        const items = props.map(prop => {
            const onChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => this._onCheckedChange(fieldName, prop.key, e, checked);

            return <FormControlLabel
                control={<Checkbox checked={prop.value} onChange={onChange}/>} label={descriptions[prop.key]}/>;
        });

        return <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup row>
                {items}
            </FormGroup>
        </FormControl>;
    }

    private getPercentages(): React.ReactNode {
        const charaIndex = this.props.charaIndex;
        const props = this.props.$.developments.getProps();
        const fieldName = nameof(this.state.errors.developments);
        const percentages = [...Enumerable.range(11)];

        const items = props.map(prop => {
            const onChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>, c: React.ReactNode) =>
                this._onSelectionChange(fieldName, prop.key, e, c);

            const selectId = `${charaIndex}_${fieldName}/${prop.key}`;
            const labelId = `label-${selectId}`;

            const options = percentages.map(i => <MenuItem value={i}>{lang.map.percentage[i]}</MenuItem>);

            return [
                <InputLabel id={labelId}>
                    {lang.map.developments[prop.key as KnownPercentageKey]}
                </InputLabel>,
                <Select labelId={labelId} id={selectId} value={prop.value}
                        onChange={onChange}>
                    {options}
                </Select>
            ];
        });

        return items;

        // const flat = items.reduce((acc, val) => acc.concat(val), []);
        //
        // return flat;
    }

    private onTextChange(fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const values = this.state.values;
        values[fieldName] = event.target.value;

        this.validateAndSetFields();
    }

    private onSelectionChange(fieldName: string, key: Nullable<string>, event: React.ChangeEvent<{ name?: string; value: unknown }>,
                              child: React.ReactNode): void {
        const values = this.state.values;
        values[fieldName] = values[fieldName] || {};

        if (Guard.isNull(key)) {
            values[fieldName] = event.target.value;
        } else {
            values[fieldName][key] = event.target.value;
        }

        this.setAutoValues();
    }

    private onCheckedChange(fieldName: string, key: Nullable<string>, event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void {
        const values = this.state.values;
        values[fieldName] = values[fieldName] || {};

        if (Guard.isNull(key)) {
            values[fieldName] = checked;
        } else {
            values[fieldName][key] = checked;
        }

        this.setAutoValues();
    }

    private validateAndSetFields(): void {
        const $ = this.props.$;
        const values = this.state.values;
        const errors = this.state.errors;

        validateString(nameof(values.lastName), value => $.lastName = value);
        validateString(nameof(values.firstName), value => $.firstName = value);
        validateString(nameof(values.nickname), value => $.nickname = value);
        validateInt(nameof(values.feeling), 0, 100, value => $.feeling = value);
        validateInt(nameof(values.hDegree), 0, 100, value => $.eroticDegree = value);
        validateInt(nameof(values.hCount), 0, 100, value => $.hCount = value);
        validateInt(nameof(values.intimacy), 0, 100, value => $.intimacy = value);

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

    private setAutoValues(): void {
        const $ = this.props.$;
        const values = this.state.values;

        Guard.defined(values.personality) && ($.personality = values.personality);
        Guard.defined(values.weakPoint) && ($.weakPoint = values.weakPoint);
        Guard.defined(values.answers) && setBooleanProperties($.answers, nameof(values.answers));
        Guard.defined(values.sexPrefs) && setBooleanProperties($.sexPrefs, nameof(values.sexPrefs));
        Guard.defined(values.traits) && setBooleanProperties($.traits, nameof(values.traits));
        Guard.defined(values.isLover) && ($.isLover = values.isLover);
        Guard.defined(values.isAngry) && ($.isAngry = values.isAngry);
        Guard.defined(values.isClubMember) && ($.isClubMember = values.isClubMember);
        Guard.defined(values.hasDate) && ($.hasDate = values.hasDate);

        {
            if (Guard.defined(values.developments)) {
                const keys = Object.keys(values.developments);

                for (const key of keys) {
                    $.developments.set(key, values.developments[key]);
                }
            }
        }

        this.setState({
            values
        });

        function setBooleanProperties(bag: PropBag<boolean>, valueName: string): void {
            const v = values[valueName];
            const keys = Object.keys(v);

            for (const k of keys) {
                bag.set(k, v[k]);
            }
        }
    }

    private readonly _onTextChange: (fieldName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    private readonly _onSelectionChange: (fieldName: string, key: Nullable<string>,
                                          event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => void;
    private readonly _onCheckedChange: (fieldName: string, key: Nullable<string>, event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;

}
