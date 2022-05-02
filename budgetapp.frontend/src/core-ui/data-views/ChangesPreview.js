import { operationType } from "./props/OperationType";
import React, { useState, useEffect, useCallback } from "react";
import { Information, AddAlt, Checkmark } from "@carbon/icons-react";
import { Modal, Button } from "@carbon/react";
import { DataService } from "../service/DataService";
import { useSensitiveData } from "../../SensitiveData";
import { ModalService } from "../service/ModalService";

export function ChangesPreview(props) {
  const sensitiveData = useSensitiveData();
  const [data, setData] = useState({ records: [] });
  const [header, setHeader] = useState("");

  const debug = () =>
    console.log(
      "================= debug =================\n",
      "props: ",
      props,
      "data: ",
      data,
      "header: ",
      header,
      "=================================="
    );

  const modalHeader = useCallback(
    (len = 0) => {
      if (!len || len === 0) {
        props.closeModal();
      }

      let operation = "";

      switch (props.operationType) {
        case operationType.insert: {
          operation = "insert(s)";
          break;
        }
        case operationType.update: {
          operation = "update(s)";
          break;
        }
        case operationType.delete: {
          operation = "deletion(s)";
          break;
        }
        default: {
          operation = "?";
          break;
        }
      }

      return `${len} ${operation} for ${props.schemaName}`;
    },
    [props]
  );
  function flCap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const performRemovalFor = (idx, type) => {
    const pending = DataService.schemaCache[props.schemaName].pendingCommits;

    const localStorageName = DataService[`get${flCap(type)}CacheName`](
      props.schemaName
    );

    setTimeout(() => {
      pending[type].splice(idx, 1);
      localStorage.setItem(localStorageName, JSON.stringify(pending[type]));

      setTimeout(() => {
        setHeader(modalHeader(pending[type].length));
        setData({ records: pending[type] });
        showConfirmDeletion(idx + 1, false);
      }, 100);
    }, 100);
  };

  const removeFromTempStorage = (idx) => {
    switch (props.operationType) {
      case operationType.insert: {
        performRemovalFor(idx, "insert");
        break;
      }
      case operationType.update: {
        performRemovalFor(idx, "update");
        break;
      }
      case operationType.delete: {
        performRemovalFor(idx, "delete");
        break;
      }
      default: {
        break;
      }
    }
  };

  const showConfirmDeletion = (itmNo, show = true) => {
    try {
      const confirmBtn = document.getElementById(`confirm-delete-${itmNo}`);
      confirmBtn.style.display = show ? "inherit" : "none";
    } catch (e) {
      // ignore attempt
    }
  };

  useEffect(() => {
    const container = document.getElementsByClassName("inserts-view-modal")[0];

    if (container) {
      const modal = container.getElementsByClassName("cds--modal-container")[0];
      const modalTitle = modal.getElementsByClassName(
        "cds--modal-header__heading"
      )[0];

      if (modal) {
        const thisModal = ModalService.eventsSet.filter(
          (itm) => itm.name === props.modalName
        );
        if (thisModal.length === 0 || !thisModal.pop().set) {
          var mousePosition = { x: 0, y: 0 };
          var offset = { x: 0, y: 0 };
          var dwn = false;

          switch (props.operationType) {
            case operationType.insert: {
              setData({
                records:
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .insert,
              });
              setHeader(
                modalHeader(
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .insert.length
                )
              );

              break;
            }
            case operationType.update: {
              setData({
                records:
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .update,
              });
              setHeader(
                modalHeader(
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .update.length
                )
              );
              break;
            }
            case operationType.delete: {
              setData({
                records:
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .delete,
              });
              setHeader(
                modalHeader(
                  DataService.schemaCache[props.schemaName].pendingCommits
                    .delete.length
                )
              );
              break;
            }
            default: {
              console.error(
                `${props.operationType} is not a supported opperation`
              );
              break;
            }
          }

          modalTitle.addEventListener("mousedown", (e) => {
            dwn = true;
            offset = {
              x: modal.offsetLeft - e.clientX + 10,
              y: modal.offsetTop - e.clientY + 10,
            };
          });
          modalTitle.addEventListener("mouseup", (e) => {
            dwn = false;
          });
          modalTitle.addEventListener("mousemove", (e) => {
            e.preventDefault();
            if (dwn) {
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
  }, [modalHeader, props.modalName, props.operationType, props.schemaName]);
  return (
    <Modal
      id={props.modalName}
      className="inserts-view-modal"
      open={props.showModal}
      passiveModal
      modalHeading={header}
      onRequestClose={props.closeModal}
    >
      <div>
        <p className="inserts-view-modal--info">
          All changes will be applied on the next save
        </p>
      </div>
      <div>
        {data.records.map((itm) => {
          const itemNo =
            DataService.schemaCache[
              props.schemaName
            ].pendingCommits.insert.indexOf(itm) + 1;
          return (
            <div className="inserts-view-modal--view">
              <div className="inserts-view-modal--heading">
                <h4 className="cdp--label inserts-view-modal--heading--header">
                  <AddAlt /> #{itemNo}
                </h4>
                <Button
                  className="inserts-view-modal--heading--button"
                  onClick={() => showConfirmDeletion(itemNo)}
                >
                  {props.actionIcon()}
                </Button>
                <Button
                  id={`confirm-delete-${itemNo}`}
                  className="inserts-view-modal--heading--button-success"
                  onClick={() => removeFromTempStorage(itemNo - 1)}
                >
                  <Checkmark /> Confirm
                </Button>
              </div>
              {DataService.schemaCache[props.schemaName].schema.fields.filter(
                (itm) => itm.fieldSensitive
              ).length > 0 && !sensitiveData.showSensitiveData ? (
                <span className="hidden-data inserts-view-modal--hidden-data">
                  <span className="hidden-data--tooltip">
                    <Information height="18" />
                    <span>Hidden</span>
                    {/* margin: 32px 0px 0px 102px; */}
                    <span className="hidden-data--tooltip--text inserts-view-modal--hidden-data">
                      This value has been hidden as privacy mode is enabled.
                    </span>
                  </span>
                </span>
              ) : (
                <code className="inserts-view-modal--data">
                  {/* {Object.keys(itm).map((row) => (
                                                <pre>
                                                  {row}
                                                  {" : "}
                                                  {itm[row]}
                                                </pre>
                                              ))} */}
                  <pre>{JSON.stringify(itm, null, 2)}</pre>
                </code>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
