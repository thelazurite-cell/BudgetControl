import { useEffect } from "react";
import { useState } from "react";
import { Close } from "@carbon/icons-react";

import styled from "styled-components";
import { WorkspaceTabService } from "../../dashboard/service/WorkspaceTabService";

const CloseableTabs = styled.div`
  margin: 0px;
`;
const TabContent = styled.div`
  padding: 0px;
`;
const TabPanel = styled.div`
  /* border-bottom: 1px solid #8d8d8d; */
  padding: 4px 0px 0;
  background: ${"#f4f4f4"};
  display: flex;
  flex-wrap: wrap;
  button.tab {
    margin-right: 1px;
    border: none;
    background: none;
    display: inline-flex;
    vertical-align: middle;
    /* padding: 4px 10px; */
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    min-height: 30px;
    min-width: 160px;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #e0e0e0;
    &.active {
      border-bottom: 2px solid
        ${(props) => (props.theme.primary ? props.theme.primary : "#0f62fe")};
      .tab-label {
        font-weight: 600;
      }
    }
    &:focus {
      box-shadow: 0 0 0 0.1rem #0f62fe;
    }
    .tab-label {
      text-align: left;
      flex: 1 1 auto;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      font-feature-settings: normal;
      font-kerning: auto;
      font-language-override: normal;
      font-optical-sizing: auto;
      font-size: 14px;
      font-size-adjust: none;
      font-stretch: 100%;
      font-style: normal;
      font-variant-alternates: normal;
      font-variant-caps: normal;
      font-variant-east-asian: normal;
      font-variant-ligatures: normal;
      font-variant-numeric: normal;
      font-variant-position: normal;
      font-variation-settings: normal;
    }
    .closeTab {
      width: 24px;
      background: none;
      height: 24px;
      display: inline-block;
      vertical-align: middle;
      /* margin-left: 5px; */
      position: relative;
      font-size: 0;
      /* border-radius: 30px; */
      /* opacity: 0.6; */
      border: 1px solid
        ${(props) => (props.theme.primary ? props.theme.primary : "#0f62fe")};
      &:hover {
        /* opacity: 0.6; */
        background: ${(props) =>
          props.theme.primary ? props.theme.primary : "#0f62fe"};
        color: #fff;
      }
      color: black;
      svg {
        padding-top: 2px;
        /* margin: 0; */
        width: 22px;
        height: 22px;
      }
    }
  }
`;
export function ClosableTabs(props) {
  let [data, setData] = useState(props.data);
  let [activeIndex, setActiveIndex] = useState(props.activeIndex);
  let [identifier] = useState(props.identifier || "id");

  useEffect(() => {
    if (!data[activeIndex]) return;
    function addTab() {
      if (WorkspaceTabService.newTabs.length === 0) {
        return;
      }
      data.push(...WorkspaceTabService.newTabs);
      const clonedData = JSON.parse(
        JSON.stringify(WorkspaceTabService.newTabs.pop())
      );
      WorkspaceTabService.newTabs = [];
      setData(data);
      setTimeout(() => {
        if (clonedData.forceReload) {
          setActiveIndex(0);
        }
        setActiveIndex(data.length - 1);
      }, 500);
    }
    WorkspaceTabService.createListener("workspaceTabs_update", addTab);
  }, [data, activeIndex, identifier]);

  const handleTabClick = (id, index) => {
    if (data[activeIndex][identifier] === id) {
      return;
    }
    props.onBeforeTabClick && props.onBeforeTabClick(id, index, activeIndex);
    setActiveIndex(0);
    setTimeout(() => setActiveIndex(index), 0);

    if (props.onTabClick) {
      props.onTabClick(id, index, activeIndex);
    }
  };

  const closeTab = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();

    data.splice(idx, 1);
    setTimeout(() => {
      setData(data);
      setTimeout(() => {
        setActiveIndex(activeIndex - 1 < 0 ? activeIndex : activeIndex - 1);
      }, 200);
    }, 150);
  };

  return (
    <CloseableTabs className={props.mainClassName || ""}>
      <TabPanel
        tabPanelColor={props.tabPanelColor}
        className={props.tabPanelClass || ""}
      >
        {data.map((item, idx) => {
          return (
            <button
              className={`tab ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleTabClick(item.id, idx)}
              key={item.id || idx}
              aria-label={item.tab}
            >
              <label className="tab-label">{item.tab}</label>
              {item.closeable && (
                <a
                  href="?#"
                  className="closeTab"
                  title={props.closeTitle || "Close tab"}
                  onClick={(e) => closeTab(e, idx)}
                  aria-label="Close Tab"
                  role="button"
                >
                  {props.renderClose ? props.renderClose() : <Close />}
                </a>
              )}
            </button>
          );
        })}
      </TabPanel>
      <TabContent className={props.tabContentClass || ""}>
        {data[activeIndex].component}
      </TabContent>
    </CloseableTabs>
  );
}
