import "../css/WarningMessage.css";
import { WarningAlt } from "@carbon/icons-react";

export function WarningMessage(props) {
  return (
    <div id={props.id} className="warning-message-container">
      <div className="warning-message-icon">
        <WarningAlt />
      </div>
      <p className="warning-message-text">{props.message}</p>
    </div>
  );
}
