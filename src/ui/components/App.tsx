import {Button} from "@material-ui/core";
import FileSaver from "file-saver";
import React from "react";
import Nullable from "../../common/types/Nullable";
import SaveData from "../../core/SaveData";
import ByteArray from "../../core/util/ByteArray";
import AppProps from "./AppProps";
import AppState from "./AppState";
import FileInput from "./FileInput";
import SaveDataPanel from "./SaveDataPanel";

const $fileInputStyles: React.CSSProperties = {
    display: "inline-block"
};

export default class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);

        this._onFileSelect = this.onFileSelect.bind(this);
        this._onFileReload = this.onFileReload.bind(this);
        this._onFileDownload = this.onFileDownload.bind(this);
    }

    render(): React.ReactNode {
        return <div>
            <FileInput onChange={this._onFileSelect} accept={[".dat"]} style={$fileInputStyles}>
                <Button color="primary" variant="contained">
                    Select Save Data
                </Button>
            </FileInput>
            <Button color="secondary" variant="contained" onClick={this._onFileReload}>
                Reload
            </Button>
            <Button color="secondary" variant="contained" onClick={this._onFileDownload}>
                Download
            </Button>
            <SaveDataPanel data={this.state.saveData}/>
        </div>;
    }

    readonly state: AppState = {
        rawData: null,
        saveData: null,
        fileName: ""
    };

    private onFileSelect(files: Nullable<FileList>): void {
        if (!files || files.length <= 0) {
            return;
        }

        const file = files[0];

        file
            .arrayBuffer()
            .then(buffer => {
                const rawData = new Uint8Array(buffer);
                const saveData = SaveData.load(rawData);

                this.setState({
                    rawData,
                    saveData,
                    fileName: file.name
                });
            });
    }

    private onFileReload(): void {
        const rawData = this.state.rawData;

        if (!rawData) {
            return;
        }

        const saveData = SaveData.load(rawData);

        this.setState({
            saveData
        });
    }

    private onFileDownload(): void {
        if (this.state.saveData && this.state.fileName) {
            const data = this.state.saveData.save();
            const blob = ByteArray.getBlob(data, "application/octet-stream");

            FileSaver.saveAs(blob, this.state.fileName);
        }
    }

    private readonly _onFileSelect: (files: Nullable<FileList>) => void;
    private readonly _onFileReload: () => void;
    private readonly _onFileDownload: () => void;

}
