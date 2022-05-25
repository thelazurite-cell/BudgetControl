import "./css/Settings.css";
import React, { useState } from "react";
import {
  Loading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@carbon/react";
import { Save, IncompleteCancel } from "@carbon/icons-react";
import { CrmTable } from "../core-ui/data-views/CrmTable";
import { DataViewManager } from "../core-ui/data-views/DataViewManager";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  function fetchData() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  // fetchData();

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <Tabs className="tabs-control">
          <TabList>
            <Tab id="terms-tab" className="settings-tab" label="Terms">
              Terms
            </Tab>
            <Tab
              id="categories-tab"
              className="settings-tab"
              label="Categories"
            >
              Categories
            </Tab>
            <Tab
              id="expenditures-tab"
              className="settings-tab"
              label="Outgoings"
            >
              Outgoings
            </Tab>
            <Tab
              id="exceptions-tab"
              className="settings-tab"
              label="Exceptions"
            >
              Exceptions
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DataViewManager schemaName="Term" />
              {/* <CrmTable schemaName="Term"></CrmTable> */}
            </TabPanel>
            <TabPanel>
              <DataViewManager schemaName="Category" />
              {/* <CrmTable schemaName="Category"></CrmTable> */}
            </TabPanel>
            <TabPanel>
              <DataViewManager schemaName="Outgoing" />
              {/* <CrmTable schemaName="Outgoing"></CrmTable> */}
            </TabPanel>
            <TabPanel>
              <DataViewManager schemaName="Exception" />
              {/* <CrmTable schemaName="Exception"></CrmTable> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </div>
  );
}
// $(document).ready(function(){

//   // Select and loop the container element of the elements you want to equalise
//   $('.container').each(function(){

//     // Cache the highest
//     var highestBox = 0;

//     // Select and loop the elements you want to equalise
//     $('.column', this).each(function(){

//       // If this box is higher than the cached highest then store it
//       if($(this).height() > highestBox) {
//         highestBox = $(this).height();
//       }

//     });

//     // Set the height of all those children to whichever was highest
//     $('.column',this).height(highestBox);

//   });

// });
