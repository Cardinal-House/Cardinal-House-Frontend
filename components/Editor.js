import React from "react";
import RichTextEditor, { EditorValue } from "react-rte";

export const Editor = (props) => {
	const [value, setValue] = React.useState(
		props.startingValue ? RichTextEditor.createValueFromString(props.startingValue, 'html') : RichTextEditor.createEmptyValue()
    );

    const change = (currValue) => {
        setValue(currValue);
        props.descriptionChange(currValue);
    }

	return (
		<RichTextEditor
            onChange={change}
			value={value}
		/>
	);
};

export default Editor;