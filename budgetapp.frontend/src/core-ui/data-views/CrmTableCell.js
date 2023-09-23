import React from "react";
import { Information } from "@carbon/icons-react";
import { TableCell, Checkbox } from "@carbon/react";
import { DataService } from "../service/DataService";
import { useSensitiveData } from "../../SensitiveData";
import { isDarkColor } from "./functions/isDarkColor";

export function CrmTableCell(props) {
  const sensitive = useSensitiveData();
  let classNames = "";
  const cellInfo = props.currentSchema.fields
    .filter((itm) => itm.fieldName === props.cell.info.header)
    .pop();

  let isSensitiveCell = cellInfo.fieldSensitive;
  const isRelatedField = cellInfo.fieldRelatesTo.length > 0;

  let displayValue = null;
  let displayColor = props.color;

  let isDeleted = false;

  if (
    DataService.schemaCache[props.schemaName] &&
    DataService.schemaCache[props.schemaName].pendingCommits
  ) {
    isDeleted =
      DataService.schemaCache[props.schemaName].pendingCommits.delete.filter(
        (itm) => itm.id === props.rowId
      ).length > 0;

    if (isDeleted) {
      classNames = "pending-delete";
    }
  }

  if (isRelatedField) {
    const relatedSchema = props.schemaCache[cellInfo.fieldRelatesTo].schema;

    const displayValueFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipView
    );

    const displayColorFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipViewColor
    );

    let relatedRecord = null;

    if (
      props.schemaCache[cellInfo.fieldRelatesTo] &&
      props.schemaCache[cellInfo.fieldRelatesTo].data
    ) {
      relatedRecord = props.schemaCache[cellInfo.fieldRelatesTo].data
        .filter((itm) => itm.id === props.cell.value)
        .pop();
    }

    if (displayValueFields.length > 0) {
      const displayValueField = (displayValueFields || []).pop();

      // check the field sensitivity of the field within the related schema.
      // if this check doesn't occur, then the value from the related data will be displayed
      // even if the sensitive data toggle was switched on
      isSensitiveCell = isSensitiveCell || displayValueField.fieldSensitive;

      if (relatedRecord) {
        displayValue = relatedRecord[displayValueField.fieldName];
        // console.log(
        //   `${props.cell.info.header}==${props.cell.value} --> ${cellInfo.fieldRelatesTo}:${relatedField.fieldName}==${relatedValue}`,
        //   relatedSchema
        // );
      }
    }
    if (displayColorFields.length > 0) {
      const displayColorField = (displayColorFields || []).pop();

      if (relatedRecord) {
        displayColor =
          relatedRecord[displayColorField.fieldName] || props.color;
      }
    }
  }

  return (
    <TableCell
      className={classNames}
      key={props.cell.id}
      style={{
        backgroundColor: displayColor ? displayColor : "unset",
        color: isDarkColor(displayColor || "#fff") ? "#fff" : "unset",
      }}
    >
      {isSensitiveCell && !sensitive.showSensitiveData ? (
        <span className="hidden-data">
          <span className="hidden-data--tooltip">
            <Information height="18" />
            <span>Hidden</span>
            <span className="hidden-data--tooltip--text">
              This value has been hidden as privacy mode is enabled.
            </span>
          </span>
        </span>
      ) : typeof props.cell.value === "boolean" ? (
        <Checkbox
          id={`${props.cell.id}:checkbox`}
          labelText=""
          checked={props.cell.value}
          disabled={true}
        />
      ) : (
        displayValue || props.cell.value
      )}
    </TableCell>
  );
}
