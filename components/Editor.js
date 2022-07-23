import React from "react";
import RichTextEditor from "react-rte";

export const Editor = (props) => {
	const [value, setValue] = React.useState(
		props.startingValue ? RichTextEditor.createValueFromString(props.startingValue, 'html') : RichTextEditor.createEmptyValue()
    );

    const change = (currValue) => {
        setValue(currValue);
        props.descriptionChange(currValue);
	}
	
	React.useEffect(() => {
		setValue(RichTextEditor.createEmptyValue());
	}, [props.loadNum])

	return (
		<RichTextEditor
            onChange={change}
			value={value}
		/>
	);
};

export default Editor;