import React, { useState } from "react";
import { Eyedropper } from "@carbon/icons-react";
import { TextInput, Button } from "@carbon/react";
import { ChromePicker } from "react-color";
import { isDarkColor } from "./functions/isDarkColor";

export function ColorPicker(props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const value = props.value ? props.value : "#ffffff";
  const [background, setBackground] = useState({ hex: value });
  return (
    <>
      <div className="color-picker--grid">
        <div className="color-picker--spread">
          <TextInput
            data-modal-primary-focus
            key={`modal:input:${props.itm.fieldName}`}
            id={`modal:input:${props.itm.fieldName}`}
            labelText={props.itm.fieldFriendlyName}
            placeholder="#fff"
            readOnly={true}
            value={background.hex}
            style={{
              marginBottom: "1rem",
              backgroundColor: background.hex ? background.hex : "unset",
              color: isDarkColor(background.hex || "#fff") ? "#fff" : "unset",
            }}
          />
        </div>
        <div className="color-picker--action">
          <Button
            className="color-picker--action--button"
            onClick={() => {
              setPickerVisible(!pickerVisible);
            }}
          >
            <Eyedropper /> <label>Pick</label>
          </Button>
        </div>
      </div>
      {pickerVisible ? (
        <ChromePicker
          key={`modal:picker:${props.itm.fieldName}`}
          color={background}
          onChangeComplete={(color) => {
            setBackground(color);
            props.onChange(color);
          }}
        />
      ) : null}
    </>
  );
}
