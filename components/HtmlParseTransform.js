import { convertNodeToElement, processNodes } from "react-html-parser";
import { Tooltip } from '@mui/material';

export default function transform(node, index) {
    // all links must open in a new window
    if (node.type === "tag" && node.name === "a") {
      node.attribs.target = "_blank";
      return convertNodeToElement(node, index, transform);
    }

    if (node.type === "tag" && node.name === "strong") {
      return (
          <strong className="boldText">
                {processNodes(node.children, transform)}
          </strong>
      )
    }
  
    if (node.type === "tag" && node.name === "tooltip") {
      return (
        <Tooltip key={index} title={node.attribs['title']} >
            <span>
                <i className="boldText">
                    {processNodes(node.children, transform)}
                </i>
            </span>
        </Tooltip>
      );
    }
  }