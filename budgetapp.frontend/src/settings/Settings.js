import "./css/Settings.scss";
import React, { useState, useEffect } from "react";
import {
  Loading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  AccordionSkeleton,
  Accordion,
  AccordionItem,
  ExpandableSearch,
} from "@carbon/react";
import { Save, IncompleteCancel, Edit } from "@carbon/icons-react";
import { CrmTable } from "../core-ui/data-views/CrmTable";
import { DataViewManager } from "../core-ui/data-views/DataViewManager";
import { ClosableTab } from "../core-ui/data-views/ClosableTab";
import { useAuth } from "../auth/Auth";
import { DataTransfer } from "../api/DataTransfer";
import { DataActionBar } from "../core-ui/data-views/DataActionBar";
import { DataManagerInline } from "../core-ui/data-views/DataManagerInline";
import { DataService } from "../core-ui/service/DataService";

export default function Settings() {
  let [isLoading, setIsLoading] = useState(true);
  let [schemas, setSchemas] = useState(null);
  let [schemaFilter, setSchemaFilter] = useState(null);
  let [filterString, setFilterString] = useState({ value: "" });
  const auth = useAuth();
  const api = new DataTransfer(auth.token);
  function dataUpdate() {
    api.findAll(
      "Schema",
      (response) => {
        DataService.schemaCache["Schema"].data = JSON.parse(
          JSON.stringify(response.data)
        );
        setSchemas(JSON.parse(JSON.stringify(response.data)));
        setSchemaFilter(JSON.parse(JSON.stringify(response.data)));
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      },
      (error) => console.log(error)
    );
  }

  useEffect(() => {
    if (!schemas) {
      if (!DataService.schemaCache["Schema"]) {
        DataService.setAuthToken(auth.token);
        DataService.createListener(`Schema`, dataUpdate);
        DataService.fetchSchema("Schema");
      }
    }
  });

  // fetchData();

  return (
    <div>
      <Tabs className="tabs-control">
        <TabList aria-label="Settings Tabs">
          <Tab
            id="terms-tab"
            className="settings-tab"
            label="Terms"
            aria-label="Terms"
          >
            Schemas
          </Tab>
          <Tab
            id="users-tab"
            className="settings-tab"
            label="Terms"
            aria-label="Terms"
          >
            Users
          </Tab>
          <Tab
            id="groups-tab"
            className="settings-tab"
            label="Groups"
            aria-label="Groups"
          >
            Groups
          </Tab>
          <Tab
            id="integrations-tab"
            className="settings-tab"
            label="Integrations"
            aria-label="Integrations"
          >
            Integrations
          </Tab>
          <Tab
            id="data-templates-tab"
            className="settings-tab"
            label="Data Templates"
            aria-label="Data Templates"
          >
            Data Templates
          </Tab>
          <Tab
            id="permissions-tab"
            className="settings-tab"
            label="Permissions"
            aria-label="Permissions"
          >
            Permissions
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {isLoading ? (
              <AccordionSkeleton open count={4} />
            ) : (
              <>
                <DataActionBar className="settings-toolbar">
                  {({
                    handleSubmit,
                    isSubmitting,
                    success,
                    description,
                    ariaLive,
                  }) => (
                    <>
                      <div className="settings-toolbar">
                        <Button kind="secondary" size="md">
                          <IncompleteCancel />
                          Revert
                        </Button>
                        <Button size="md">
                          <Save />
                          Save
                        </Button>
                        <div className="toolbar-spacer"></div>
                        <ExpandableSearch
                          size="md"
                          labelText="Search"
                          closeButtonLabelText="Clear search input"
                          id="schemas-search"
                          onKeyUp={(e) => {
                            const regex = new RegExp(e.target.value, "gi");
                            setSchemaFilter(
                              schemas.filter(
                                (itm) =>
                                  regex.exec(itm.schemaName) ||
                                  regex.exec(itm.viewFriendlyName)
                              )
                            );
                          }}
                        />
                      </div>
                    </>
                  )}
                </DataActionBar>
                <Accordion>
                  {schemaFilter.map((itm) => {
                    const schemaTitle = itm.viewFriendlyName
                      ? `${itm.viewFriendlyName} (${itm.schemaName})`
                      : itm.schemaName;

                    return (
                      <AccordionItem
                        key={`${new Date().valueOf()}-${itm.schemaName}`}
                        title={schemaTitle}
                      >
                        <Button size="md">
                          <Edit />
                          Edit
                        </Button>
                        <DataManagerInline
                          schemaName={"Schema"}
                          dataType={DataService.schemaCache["Schema"]}
                          existingId={itm.id}
                        />
                        {Object.keys(itm).map((key) => {
                          return (
                            <>
                              <p
                                key={`${new Date().valueOf()}-${
                                  itm.schemaName
                                }-${key}`}
                              >
                                {key}
                              </p>
                              <p
                                key={`${new Date().valueOf()}-${
                                  itm.schemaName
                                }-${key}-value`}
                              >
                                {JSON.stringify(itm[key])}
                              </p>
                            </>
                          );
                        })}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </>
            )}
          </TabPanel>
          <TabPanel>
            <p>Users</p>
          </TabPanel>
          <TabPanel>
            <p>Groups</p>
          </TabPanel>
          <TabPanel>
            <p>Integrations</p>
          </TabPanel>
          <TabPanel>
            <p>Data Templates</p>
          </TabPanel>
          <TabPanel>
            <p>Permissions</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
