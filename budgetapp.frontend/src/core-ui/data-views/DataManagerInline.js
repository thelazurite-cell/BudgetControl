import { dataType } from "./props/DataType";
import React, { useState } from "react";
import {
  Checkbox,
  TextInput,
  Select,
  SelectItem,
  Modal,
  NumberInput,
} from "@carbon/react";
import { DataService } from "../service/DataService";
import { isDarkColor } from "./functions/isDarkColor";
import { ColorPicker } from "./ColorPicker";
import { DraggableModal } from "./DraggableModal";

export function createRecordTemplate(modifiableFields) {
  const recordTemplate = { id: "" };
  modifiableFields.forEach((itm) => {
    switch (itm.fieldType) {
      case dataType.color: {
        recordTemplate[itm.fieldName] = "#ffffff";
        break;
      }
      case dataType.number: {
        recordTemplate[itm.fieldName] = 0;
        break;
      }
      case dataType.boolean: {
        recordTemplate[itm.fieldName] = false;
        break;
      }
      default: {
        recordTemplate[itm.fieldName] = "";
        break;
      }
    }
  });
  return recordTemplate;
}

export function DataManagerInline(props) {
  const modifiableFields = props.dataType.schema.fields.filter(
    (itm) => !itm.systemField
  );

  let recordTemplate = {};

  if (props.existingId) {
    const val = props.dataType.data.filter(
      (itm) => itm.id === props.existingId
    );

    recordTemplate = createRecordTemplate(modifiableFields);

    if (val && val.length > 0) {
      recordTemplate = JSON.parse(JSON.stringify(val[0]));
    }
  } else {
    recordTemplate = createRecordTemplate(modifiableFields);

    modifiableFields.forEach((itm) => {
      switch (itm.fieldType) {
        case dataType.color: {
          recordTemplate[itm.fieldName] = "#ffffff";
          break;
        }
        case dataType.number: {
          recordTemplate[itm.fieldName] = 0;
          break;
        }
        case dataType.boolean: {
          recordTemplate[itm.fieldName] = false;
          break;
        }
        default: {
          recordTemplate[itm.fieldName] = "";
          break;
        }
      }
    });
  }

  console.log(recordTemplate);

  const [record, setRecord] = useState(recordTemplate);

  return (
    <>
      {modifiableFields.map((itm) => {
        // return <p key={`modal:${itm.fieldName}`}>{itm.fieldFriendlyName}</p>;
        if (itm.fieldType === dataType.id) {
          const related = DataService.schemaCache[itm.fieldRelatesTo];
          console.log(`relatedData:`, related);

          const relatedSchema = related.schema;

          const displayValueField = relatedSchema.fields
            .filter((itm) => itm.relationshipView)
            .pop();

          const displayColorField = relatedSchema.fields
            .filter((itm) => itm.relationshipViewColor)
            .pop();

          const id = `modal:drop-down:${itm.fieldName}`;
          return (
            <Select
              key={id}
              id={id}
              defaultValue={record[itm.fieldName]}
              // value={record[itm.fieldName]}
              labelText={itm.fieldFriendlyName}
              onChange={(e) => {
                console.log(e);
                record[itm.fieldName] = e.target.selectedOptions[0].value;
                setRecord(JSON.parse(JSON.stringify(record)));
              }}
            >
              {related.data.map((selectItem) => {
                if (record[itm.fieldName] === "") {
                  record[itm.fieldName] = selectItem.id;
                }

                const displayColor = displayColorField
                  ? selectItem[displayColorField.fieldName]
                  : "unset";
                return (
                  <SelectItem
                    key={`modal:drop-down:${itm.fieldName}:itm:${selectItem.id}`}
                    style={{
                      backgroundColor: displayColor ? displayColor : "unset",
                      color: isDarkColor(
                        displayColor === "unset" ? "#fff" : displayColor
                      )
                        ? "#fff"
                        : "unset",
                    }}
                    value={selectItem.id}
                    text={selectItem[displayValueField.fieldName]}
                  />
                );
              })}
            </Select>
          );
        } else if (itm.fieldType === dataType.color) {
          const id = `modal:color-picker:${itm.fieldName}`;
          return (
            <ColorPicker
              key={id}
              itm={itm}
              color={record[itm.fieldName].toString()}
              value={record[itm.fieldName].toString()}
              onChange={(value) => {
                record[itm.fieldName] = value.hex;
                setRecord(JSON.parse(JSON.stringify(record)));
              }}
            />
          );
        } else if (itm.fieldType === dataType.number) {
          const id = `modal:number-input:${itm.fieldName}`;
          return (
            <NumberInput
              key={id}
              id={id}
              // min={0}
              // max={100}
              // value={50}
              label={itm.fieldFriendlyName}
              placeholder={itm.fieldPlaceholder}
              value={record[itm.fieldName]}
              helperText=""
              invalidText="Number is not valid"
              onClick={(e) => {
                record[itm.fieldName] = +document
                  .getElementById(id)
                  .getAttribute("value");
                setRecord(JSON.parse(JSON.stringify(record)));
                e.preventDefault();
                e.cancelBubble = true;
              }}
              onChange={(e) => {
                if (!Number.isNaN(e.target.value) && e.target.value) {
                  record[itm.fieldName] = +e.target.value;
                  setRecord(JSON.parse(JSON.stringify(record)));
                }
              }}
            />
          );
        } else if (itm.fieldType === dataType.boolean) {
          const id = `modal:check-box:${itm.fieldName}`;
          return (
            <fieldset key={`cds--fieldset${id}`} className={`cds--fieldset`}>
              <legend key={`cds--label${id}`} className={`cds--label`}>
                {itm.fieldFriendlyName}
              </legend>
              <Checkbox
                id={id}
                key={id}
                labelText={" "}
                aria-label={itm.fieldFriendlyName}
                checked={record[itm.fieldName]}
                onChange={(e) => {
                  record[itm.fieldName] = e.target.checked;
                  setRecord(JSON.parse(JSON.stringify(record)));
                }}
              />
            </fieldset>
          );
        } else {
          const id = `modal:input:${itm.fieldName}`;
          return (
            <>
              <TextInput
                data-modal-primary-focus
                key={id}
                id={id}
                labelText={itm.fieldFriendlyName}
                placeholder={itm.fieldPlaceholder}
                style={{ marginBottom: "1rem" }}
                value={record[itm.fieldName]}
                onChange={(e) => {
                  if (e.target.value || e.target.value === "") {
                    record[itm.fieldName] = e.target.value;
                    setRecord(JSON.parse(JSON.stringify(record)));
                  }
                }}
              />
            </>
          );
        }
      })}
      {!props.existingId ? (
        <Checkbox
          labelText="Create Another"
          aria-label="create another record"
          id="create-another"
        />
      ) : null}
    </>
  );
}
