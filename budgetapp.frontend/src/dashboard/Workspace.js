import { useEffect, useState } from "react";
import { ClosableTabs } from "../core-ui/data-views/ClosableTabs";
import { WorkspaceTabService } from "./service/WorkspaceTabService";

function Workspace() {
  let [tabs, setTabs] = useState({
    data: [
      {
        tab: "Home",
        component: (
          <div>
            <p>Landing Page</p>
          </div>
        ),
        id: 0,
      },
    ],
  });
  let [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <ClosableTabs
        tabPanelColor="lightgray"
        data={tabs.data}
        onCloseTab={(id, newIndex) => {
          const newData = tabs.data.filter((itm) => itm.id !== id);
          tabs.data = newData;
          setTabs(tabs);

          setActiveTab(newIndex);
        }}
        activeIndex={activeTab}
      />
    </div>
  );
}

export default Workspace;
