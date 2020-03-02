import {Avatar, Card, CardContent, CardHeader, Grid, IconButton} from "@material-ui/core";
import {lightBlue, pink} from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {sha256} from "js-sha256";
import React from "react";
import Gender from "../../core/Gender";
import CommonCharacterPanelProps from "./CommonCharacterPanelProps";
import CommonCharacterPanelState from "./CommonCharacterPanelState";
import PhotoPanel from "./PhotoPanel";

const $cardStyle: React.CSSProperties = {
    overflow: "visible"
};
const $photoStyle: React.CSSProperties = {
    width: 240,
    height: 320
};

export default class CommonCharacterPanel extends React.Component<CommonCharacterPanelProps, CommonCharacterPanelState> {

    render(): React.ReactNode {
        const avatarColor = this.props.$.gender === Gender.Male ? lightBlue["500"] : pink["500"];
        const imageHash = sha256.hex(this.props.$.photo);

        return <Card className="f-grid-cell" style={$cardStyle}>
            <CardHeader
                avatar={
                    <Avatar style={{backgroundColor: avatarColor}}>
                        {this.props.$.firstName}
                    </Avatar>
                }
                action={
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={this.props.$.lastName}
                subheader={this.props.$.firstName}
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <PhotoPanel data={this.props.$.photo} key={imageHash}/>
                    </Grid>
                    <Grid item>
                        {this.props.children}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>;
    }

}
