import React from "react";
import ByteArray from "../../core/util/ByteArray";
import PhotoPanelProps from "./PhotoPanelProps";
import PhotoPanelState from "./PhotoPanelState";

export default class PhotoPanel extends React.Component<PhotoPanelProps, PhotoPanelState> {

    constructor(props: PhotoPanelProps) {
        super(props);

        const data = this.props.data;
        const blob = ByteArray.getBlob(data!, "image/png");
        this.state.url = URL.createObjectURL(blob);
    }

    componentWillUnmount(): void {
        URL.revokeObjectURL(this.state.url);
    }

    render(): React.ReactNode {
        return <img src={this.state.url} alt={"ID Photo"} style={this.props.style}/>;
    }

    readonly state: PhotoPanelState = {
        url: ""
    };

}
