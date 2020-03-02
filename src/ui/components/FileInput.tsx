import React, {ChangeEvent} from "react";
import Nullable from "../../common/types/Nullable";
import FileInputProps from "./FileInputProps";
import FileInputState from "./FileInputState";

// Inspired by https://github.com/meinstein/react-file-picker
export default class FileInput extends React.Component<FileInputProps, FileInputState> {

    constructor(props: FileInputProps) {
        super(props);

        this._onFileChange = this.onFileChange.bind(this);
    }

    render(): React.ReactNode {
        const allAccepts = this.props.accept.join(",");

        return <div style={this.props.style}>
            <input type="file" hidden={true} onChange={this._onFileChange} accept={allAccepts}
                   ref={elem => (this._fileInput = elem)}/>
            {React.cloneElement(this.props.children, {
                onClick: () => this._fileInput!.click()
            })}
        </div>;
    }

    private onFileChange(event: ChangeEvent<HTMLInputElement>): void {
        const files = event.target.files;
        this.props.onChange(files);

        // Allows re-selecting
        event.target.value = "";
    }

    private readonly _onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    private _fileInput?: Nullable<HTMLInputElement>;

}
