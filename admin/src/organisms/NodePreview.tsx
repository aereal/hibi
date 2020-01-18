import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Node as SlateNode } from "slate";
import { serialize } from "../editor/conversion";

const stringify = (x: any): string => JSON.stringify(x, null, 2);

interface NodePreviewProps {
  readonly nodes: SlateNode[];
}

export const NodePreview: FC<NodePreviewProps> = ({ nodes }) => (
  <>
    <SerializedNodePreview nodes={nodes} />
    <DeserializedNodePreview nodes={nodes} />
  </>
);

const SerializedNodePreview: FC<NodePreviewProps> = ({ nodes }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Serialized Node Preview (internal)</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <pre>{stringify(serialize(nodes))}</pre>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

const DeserializedNodePreview: FC<NodePreviewProps> = ({ nodes }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Node Preview (internal)</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <pre>{stringify(nodes)}</pre>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);
