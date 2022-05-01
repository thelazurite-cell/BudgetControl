import React, { useState, useEffect, useCallback } from "react";
import { unmountComponentAtNode } from "react-dom";
import {
  TrashCan as Delete,
  Save,
  Download,
  Information,
  Eyedropper,
  Warning,
  AddAlt,
  Checkmark,
  Undo,
} from "@carbon/icons-react";
import { useAuth } from "../../auth/Auth";
import {
  Tag,
  DataTable,
  DataTableSkeleton,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableRow,
  TableHead,
  TableHeader,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  unstable_PageSelector as PageSelector,
  unstable_Pagination as Pagination,
  Checkbox,
  TextInput,
  Select,
  SelectItem,
  Modal,
  Button,
  NumberInput,
} from "@carbon/react";
import { ChromePicker } from "react-color";
import "../css/CrmTable.css";
import { DataService } from "../service/DataService";
import { useSensitiveData } from "../../SensitiveData";
import { ModalService } from "../service/ModalService";

const sizes = {
  Compact: "xs",
  Short: "short",
  Medium: "medium",
  Default: null,
  Tall: "tall",
};

const operationType = {
  insert: 0,
  update: 1,
  delete: 2,
};

const tableProps = {
  sizeProp: () => {
    return {
      size: sizes.Compact,
    };
  },
};

const paginationProps = () => ({
  disabled: false,
  pagesUnknown: false,
  backwardText: "Previous page",
  forwardText: "Next page",
  pageSize: 10,
  itemsPerPageText: "Items per page:",
  size: sizes.Compact,
  onChange: () => console.log("Pagination Change"),
});

const WithAPageSelector = () => (
  <Pagination {...paginationProps()} totalItems={350} pageSizes={[10, 20, 30]}>
    {({ currentPage, onSetPage, totalPages }) => (
      <PageSelector
        currentPage={currentPage}
        id={`page-selector`}
        onChange={(event) => onSetPage(event.target.value)}
        totalPages={totalPages}
      />
    )}
  </Pagination>
);
function isDarkColor(color) {
  let r;
  let g;
  let b;
  let a = 1;
  let hsp;

  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );
    r = color[1];
    g = color[2];
    b = color[3];
    a = color[4];
  } else {
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  if (a === 0) {
    return false;
  }
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / a;

  return hsp <= 127.5;
}

export const dataType = {
  id: 0,
  relatedId: 1,
  string: 2,
  number: 3,
  dateTime: 4,
  boolean: 5,
  color: 6,
};

export const ColorPicker = (props) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [background, setBackground] = useState({ hex: "#ffffff" });
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
};

export function createRecordTemplate(modifiableFields) {
  const recordTemplate = { id: "" };
  modifiableFields.map((itm) => {
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

export const DataManager = (props) => {
  console.log(props.dataType);
  const modifiableFields = props.dataType.schema.fields.filter(
    (itm) => !itm.systemField
  );

  let recordTemplate = createRecordTemplate(modifiableFields);

  modifiableFields.map((itm) => {
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

  console.log(recordTemplate);

  const [record, setRecord] = useState(recordTemplate);

  return (
    <Modal
      modalHeading={`Add ${props.schemaName}`}
      modalLabel="Insert Data"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
      open={true}
      onRequestClose={() => props.onRequestClose()}
      onRequestSubmit={() => {
        props.onNewRecord(recordTemplate);

        if (document.getElementById("create-another").checked) {
        } else {
          props.onRequestClose();
        }
      }}
    >
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
              defaultValue={recordTemplate[itm.fieldName]}
              // value={record[itm.fieldName]}
              labelText={itm.fieldFriendlyName}
              onChange={(e) => {
                console.log(e);
                recordTemplate[itm.fieldName] =
                  e.target.selectedOptions[0].value;
                setRecord(recordTemplate);
              }}
            >
              {related.data.map((selectItem) => {
                if (recordTemplate[itm.fieldName] === "") {
                  recordTemplate[itm.fieldName] = selectItem.id;
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
              color={recordTemplate[itm.fieldName]}
              onChange={(value) => {
                recordTemplate[itm.fieldName] = value.hex;
                setRecord(recordTemplate);
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
                recordTemplate[itm.fieldName] = +document
                  .getElementById(id)
                  .getAttribute("value");
                setRecord(recordTemplate);
                e.preventDefault();
                e.cancelBubble = true;
              }}
              onChange={(e) => {
                if (!isNaN(e.target.value) && e.target.value) {
                  recordTemplate[itm.fieldName] = +e.target.value;
                  setRecord(recordTemplate);
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
                  recordTemplate[itm.fieldName] = e.target.checked;
                  setRecord(recordTemplate);
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
                value={record[itm.value]}
                onChange={(e) => {
                  recordTemplate[itm.fieldName] = e.target.value;
                  setRecord(recordTemplate);
                }}
              />
            </>
          );
        }
      })}
      <Checkbox
        labelText="Create Another"
        aria-label="create another record"
        id="create-another"
      />
    </Modal>
  );
};

export const ChangesPreview = (props) => {
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
      // if (!len || len === 0) {
      //   props.closeModal();
      // }

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

  const removeFromTempStorage = (idx) => {
    switch (props.operationType) {
      case operationType.insert: {
        const pending =
          DataService.schemaCache[props.schemaName].pendingCommits;

        const localStorageName = DataService.getInsertCacheName(
          props.schemaName
        );

        setTimeout(() => {
          pending.insert.splice(idx, 1);
          localStorage.setItem(
            localStorageName,
            JSON.stringify(pending.insert)
          );

          setTimeout(() => {
            setHeader(modalHeader(pending.insert.length));
            setData({ records: pending.insert });
            showConfirmDeletion(idx + 1, false);
          }, 100);
        }, 100);

        break;
      }
      case operationType.update: {
        break;
      }
      case operationType.delete: {
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
};

export const CrmTable = (props) => {
  const [headers, setHeaders] = useState({ headers: [] });
  const [data, setData] = useState({ data: [] });
  const [loadingHeaders, setLoadingHeaders] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [expandable, setExpandable] = useState(false);
  const [schemaName, setSchemaName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [insertModal, setInsertModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    function dataUpdate() {
      try {
        setHeaders({
          headers: DataService.schemaCache[props.schemaName].headers,
        });

        setExpandable(
          DataService.schemaCache[props.schemaName].schema.isExpandable
        );
        setSchemaName(
          DataService.schemaCache[props.schemaName].schema.schemaName
        );

        if (DataService.schemaCache[props.schemaName].data) {
          setData({
            data: DataService.schemaCache[props.schemaName].data,
          });
          setLoadingData(false);
        }

        setLoadingHeaders(false);
      } catch (e) {
        console.log("Couldn't load data");
      }
    }

    DataService.setAuthToken(auth.token);
    DataService.createListener(props.schemaName, dataUpdate);

    if (!DataService.schemaCache[props.schemaName]) {
      DataService.fetchSchema(props.schemaName);
    }
    if (
      DataService.schemaCache[props.schemaName] &&
      !DataService.schemaCache[props.schemaName].data
    ) {
      DataService.fetchAll(props.schemaName);
    } else if (loadingHeaders) {
      setTimeout(() => {
        dataUpdate();
      }, 1500);
    }
  }, [props.schemaName, auth.token, loadingHeaders]);

  const batchActionClick = (selectedRows) => {
    // console.log(selectedRows);
  };

  const insertInRandomPosition = (array, element) => {
    const index = Math.floor(Math.random() * (array.length + 1));
    return [...array.slice(0, index), element, ...array.slice(index)];
  };

  class DynamicRows extends React.Component {
    state = {
      rows: data.data,
      headers: headers.headers,
      id: 0,
    };

    handleOnHeaderAdd = () => {
      const length = this.state.headers.length;
      const header = {
        key: `header_${length}`,
        header: `Header ${length}`,
      };

      this.setState((state) => {
        const rows = state.rows.map((row) => {
          return {
            ...row,
            [header.key]: header.header,
          };
        });
        return {
          rows,
          headers: state.headers.concat(header),
        };
      });
    };

    handleOnRowAdd = () => {
      this.setState((state) => {
        const { id: _id, rows } = state;
        const id = _id + 1;
        const row = {
          id: "" + id,
          name: `New Row ${id}`,
          protocol: "HTTP",
          port: id * 100,
          rule: id % 2 === 0 ? "Round robin" : "DNS delegation",
          attached_groups: `Row ${id}'s VM Groups`,
          status: "Starting",
        };

        state.headers
          .filter((header) => row[header.key] === undefined)
          .forEach((header) => {
            row[header.key] = header.header;
          });

        return {
          id,
          rows: insertInRandomPosition(rows, row),
        };
      });
    };

    render() {
      const sizeProp = tableProps.sizeProp();
      const insertsCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.insert.length >
          0;

      const updatesCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.update.length >
          0;

      const deletesCached =
        DataService.schemaCache[props.schemaName] &&
        DataService.schemaCache[props.schemaName].pendingCommits &&
        DataService.schemaCache[props.schemaName].pendingCommits.delete.length >
          0;

      const modalName = "changes-preview";
      return loadingHeaders || loadingData ? (
        <DataTableSkeleton />
      ) : (
        <>
          {modalOpen ? (
            <DataManager
              onRequestClose={() => setModalOpen(false)}
              onNewRecord={(data) => {
                const pendingInserts = DataService.getInsertCacheName(
                  props.schemaName
                );

                DataService.schemaCache[
                  props.schemaName
                ].pendingCommits.insert.push(JSON.parse(JSON.stringify(data)));
                localStorage.setItem(
                  pendingInserts,
                  JSON.stringify(
                    DataService.schemaCache[props.schemaName].pendingCommits
                      .insert
                  )
                );
              }}
              schemaName={schemaName}
              dataType={DataService.schemaCache[props.schemaName]}
            />
          ) : null}
          {insertModal ? (
            <ChangesPreview
              modalName={modalName}
              showModal={insertModal}
              closeModal={() => {
                ModalService.resetModalEvents(modalName);

                setInsertModal(false);
              }}
              schemaName={props.schemaName}
              operationType={operationType.insert}
              actionIcon={() => <Delete />}
            />
          ) : null}
          {updateModal ? (
            <ChangesPreview
              modalName={modalName}
              showModal={updateModal}
              closeModal={() => {
                ModalService.resetModalEvents(modalName);

                setUpdateModal(false);
              }}
              schemaName={props.schemaName}
              operationType={operationType.update}
              actionIcon={() => <Delete />}
            />
          ) : null}
          {deleteModal ? (
            <ChangesPreview
              modalName={modalName}
              showModal={deleteModal}
              closeModal={() => {
                ModalService.resetModalEvents(modalName);

                setDeleteModal(false);
              }}
              schemaName={props.schemaName}
              operationType={operationType.delete}
              actionIcon={() => <Undo />}
            />
          ) : null}
          <div className="data-table--warnings">
            {insertsCached ? (
              <Tag
                className="data-table--warnings--tag"
                size="sm"
                title="Clear Filter"
                type="purple"
                aria-label="view unsaved inserts button"
                role="button"
                onClick={() => setInsertModal(true)}
              >
                <Warning />{" "}
                <p className="data-table--warnings--tag--label">
                  {
                    DataService.schemaCache[props.schemaName].pendingCommits
                      .insert.length
                  }{" "}
                  unsaved insert(s)
                </p>
              </Tag>
            ) : null}
            {deletesCached ? (
              <Tag
                className="data-table--warnings--tag"
                size="sm"
                title="Clear Filter"
                type="red"
                aria-label="view unsaved deletions button"
                role="button"
                onClick={() => setDeleteModal(true)}
              >
                <Warning />{" "}
                <p className="data-table--warnings--tag--label">
                  {
                    DataService.schemaCache[props.schemaName].pendingCommits
                      .delete.length
                  }{" "}
                  unsaved deletion(s)
                </p>
              </Tag>
            ) : null}
            {updatesCached ? (
              <Tag
                className="data-table--warnings--tag"
                size="sm"
                title="Clear Filter"
                type="teal"
                aria-label="view unsaved updates button"
                role="button"
                onClick={() => setUpdateModal(true)}
              >
                <Warning />
                <p className="data-table--warnings--tag--label">
                  {
                    DataService.schemaCache[props.schemaName].pendingCommits
                      .update.length
                  }{" "}
                  unsaved update(s)
                </p>
              </Tag>
            ) : null}
          </div>
          <DataTable
            rows={this.state.rows}
            headers={this.state.headers}
            {...this.props}
            render={({
              rows,
              headers,
              getHeaderProps,
              getSelectionProps,
              getToolbarProps,
              getBatchActionProps,
              getRowProps,
              onInputChange,
              selectedRows,
              getTableProps,
              getTableContainerProps,
            }) => (
              <TableContainer
                title={schemaName}
                //   description="Use the toolbar menu to add rows and headers"
                {...getTableContainerProps()}
              >
                <TableToolbar {...getToolbarProps()}>
                  <TableBatchActions {...getBatchActionProps()}>
                    <TableBatchAction
                      renderIcon={Delete}
                      iconDescription="Delete the selected rows"
                      onClick={batchActionClick(selectedRows)}
                    >
                      Delete
                    </TableBatchAction>
                    <TableBatchAction
                      renderIcon={Save}
                      iconDescription="Save the selected rows"
                      onClick={batchActionClick(selectedRows)}
                    >
                      Save
                    </TableBatchAction>
                    <TableBatchAction
                      renderIcon={Download}
                      iconDescription="Download the selected rows"
                      onClick={batchActionClick(selectedRows)}
                    >
                      Download
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent>
                    <TableToolbarSearch onChange={onInputChange} />
                    <TableToolbarMenu>
                      <TableToolbarAction onClick={() => setModalOpen(true)}>
                        Add row
                      </TableToolbarAction>
                      <TableToolbarAction onClick={this.handleOnHeaderAdd}>
                        Add header
                      </TableToolbarAction>
                    </TableToolbarMenu>
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()} {...sizeProp}>
                  <TableHead>
                    <TableRow>
                      {expandable ? <TableExpandHeader /> : null}
                      <TableSelectAll {...getSelectionProps()} />
                      {headers.map((header, i) => (
                        <TableHeader key={i} {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      if (loadingData) {
                        return null;
                      }
                      let color;
                      const colorCell = row.cells.filter(
                        (cell) => cell.info.header === "color"
                      );
                      if (colorCell.length > 0) {
                        color = colorCell.pop().value || "#fff";
                      }

                      const id = row.id;
                      const fullData = data.data
                        .filter((r) => r.id === id)
                        .pop();

                      const currentSchema =
                        DataService.schemaCache[schemaName].schema;

                      const descriptionCell = currentSchema.fields
                        .filter((itm) => itm.expandableDescription === true)
                        .pop();

                      const headerCell = currentSchema.fields
                        .filter((itm) => itm.expandableHeader === true)
                        .pop();

                      return (
                        <React.Fragment key={row.id}>
                          {expandable ? (
                            <>
                              <TableExpandRow {...getRowProps({ row })}>
                                <TableSelectRow
                                  {...getSelectionProps({ row })}
                                />
                                {row.cells.map((cell) => (
                                  <CrmTableCell
                                    key={`${id}:${cell.id}:CrmTableCell`}
                                    color={color}
                                    currentSchema={currentSchema}
                                    schemaCache={DataService.schemaCache}
                                    cell={cell}
                                  />
                                ))}
                              </TableExpandRow>
                              <TableExpandedRow
                                colSpan={headers.length + 3}
                                className="demo-expanded-td"
                              >
                                <>
                                  <h6>
                                    {fullData
                                      ? fullData[headerCell.fieldName]
                                      : null || "No Header Provided"}
                                  </h6>
                                  <div>
                                    {fullData
                                      ? fullData[descriptionCell.fieldName]
                                      : null || "No Description Provided"}
                                  </div>
                                </>
                              </TableExpandedRow>
                            </>
                          ) : (
                            <TableRow {...getRowProps({ row })}>
                              <TableSelectRow {...getSelectionProps({ row })} />
                              {row.cells.map((cell) => (
                                <CrmTableCell
                                  key={`${id}:${cell.id}:CrmTableCell`}
                                  color={color}
                                  currentSchema={currentSchema}
                                  schemaCache={DataService.schemaCache}
                                  cell={cell}
                                />
                              ))}
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
                <WithAPageSelector></WithAPageSelector>
              </TableContainer>
            )}
          />
        </>
      );
    }
  }
  return <DynamicRows {...props} />;
};

export const CrmTableCell = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const sensitive = useSensitiveData();

  const cellInfo = props.currentSchema.fields
    .filter((itm) => itm.fieldName === props.cell.info.header)
    .pop();

  let isSensitiveCell = cellInfo.fieldSensitive;
  const isRelatedField = cellInfo.fieldRelatesTo.length > 0;

  let displayValue = null;
  let displayColor = props.color;

  if (isRelatedField) {
    const relatedSchema = props.schemaCache[cellInfo.fieldRelatesTo].schema;

    const displayValueFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipView
    );

    const displayColorFields = relatedSchema.fields.filter(
      (itm) => itm.relationshipViewColor
    );

    const relatedRecord = props.schemaCache[cellInfo.fieldRelatesTo].data
      .filter((itm) => itm.id === props.cell.value)
      .pop();

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
};
