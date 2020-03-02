import React from "react";
import Nullable from "../../common/types/Nullable";

export default interface FileInputProps {

    // tslint:disable-next-line:prefer-method-signature
    onChange: (files: Nullable<FileList>) => void;

    accept: string[];

    style?: React.CSSProperties;

    children: React.ReactElement;

}
