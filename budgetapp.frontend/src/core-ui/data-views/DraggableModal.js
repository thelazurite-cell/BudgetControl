import React, { useState, useEffect } from "react";
import { ModalService } from "../service/ModalService";
import { Modal } from "@carbon/react";
import "../css/DraggableModal.css";

export function DraggableModal({ children, ...props }) {
  function flCap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    const container = document.getElementsByClassName("inserts-view-modal")[0];

    if (container) {
      const backdrop = document.getElementsByClassName("cds--modal")[0];
      const modal = container.getElementsByClassName("cds--modal-container")[0];
      const modalTitle = modal.getElementsByClassName("cds--modal-header")[0];
      const closeBtn = modalTitle.getElementsByClassName("cds--modal-close")[0];

      if (modal) {
        const thisModal = ModalService.eventsSet.filter(
          (itm) => itm.name === props.modalName
        );
        if (thisModal.length === 0 || !thisModal.pop().set) {
          var mousePosition = { x: 0, y: 0 };
          var offset = { x: 0, y: 0 };
          var dwn = false;
          var closeDwn = false;
          modalTitle.addEventListener("mousedown", (e) => {
            dwn = true;
            offset = {
              x: modal.offsetLeft - e.clientX + 10,
              y: modal.offsetTop - e.clientY + 10,
            };
          });
          closeBtn.addEventListener("mousedown", (e) => {
            closeDwn = true;
          });
          closeBtn.addEventListener("mouseup", (e) => {
            closeDwn = false;
          });
          backdrop.addEventListener("mouseup", (e) => {
            dwn = false;
            closeDwn = false;
          });
          modal.addEventListener("mouseup", (e) => {
            dwn = false;
            closeDwn = false;
          });
          modalTitle.addEventListener("mouseup", (e) => {
            dwn = false;
            closeDwn = false;
          });
          modalTitle.addEventListener("mousemove", (e) => {
            e.preventDefault();
            if (dwn && !closeDwn) {
              mousePosition = {
                x: e.clientX,
                y: e.clientY,
              };
              modal.style.left = mousePosition.x + offset.x + "px";
              modal.style.top = mousePosition.y + offset.y + "px";
            }
          });
          ModalService.eventsSet.push({ name: props.modalName, set: true });
        }
      }
    }
  }, [props.modalName, props.operationType, props.schemaName]);

  useEffect(() => {
    return () => {
      ModalService.eventsSet.push({ name: props.modalName, set: false });
    };
  }, []);

  return <Modal {...props}>{children}</Modal>;
}
