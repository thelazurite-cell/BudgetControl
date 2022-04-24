import "./css/Settings.css";
import React, { useState } from "react";
import {
  Header,
  Button,
  InlineLoading,
  Loading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@carbon/react";
import { Save, IncompleteCancel } from "@carbon/icons-react";
import { NotificationService } from "../core-ui/service/NotificationService";
import { NotificationProps } from "../core-ui/data/NotificationProps";
import { randstring } from "../api/String.helpers";
import { CrmTable } from "../core-ui/data-views/CrmTable";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  function fetchData() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  function DataActionBar({ children }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState("Submitting...");
    const [ariaLive, setAriaLive] = useState("off");
    const handleSubmit = (cb) => {
      setIsSubmitting(true);
      setAriaLive("assertive");

      // Instead of making a real request, we mock it with a timer
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setDescription("Submitted!");

        const notification = new NotificationProps(
          "Changes Saved",
          randstring()
        );

        notification.openPanel = true;
        notification.onButtonClick = (text) => {
          alert(text);
        };

        NotificationService.add(notification);

        // To make submittable again, we reset the state after a bit so the user gets completion feedback
        setTimeout(() => {
          setSuccess(false);
          setDescription("Submitting...");
          setAriaLive("off");

          if (cb) {
            cb();
          }
        }, 1500);
      }, 2000);
    };

    return children({
      handleSubmit,
      isSubmitting,
      success,
      description,
      ariaLive,
    });
  }

  fetchData();

  return (
    <div>
      <Header className="settings-header" aria-label="action bar">
        <DataActionBar>
          {({ handleSubmit, isSubmitting, success, description, ariaLive }) => (
            <div style={{ display: "flex", width: "300px" }}>
              <Button
                kind="secondary"
                className="action-button"
                disabled={isSubmitting || success}
              >
                <label className="action-button-label">
                  <IncompleteCancel />
                </label>
              </Button>
              {isSubmitting || success ? (
                <InlineLoading
                  style={{ marginLeft: "1rem" }}
                  description={description}
                  status={success ? "error" : "active"}
                  aria-live={ariaLive}
                />
              ) : (
                <Button
                  id="save"
                  className="action-button"
                  onClick={() => handleSubmit(fetchData)}
                >
                  <label className="action-button-label">
                    <Save />
                  </label>
                </Button>
              )}
            </div>
          )}
        </DataActionBar>
      </Header>
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
              <CrmTable schemaName="Term"></CrmTable>
            </TabPanel>
            <TabPanel>
              <CrmTable schemaName="Category"></CrmTable>
            </TabPanel>
            <TabPanel>
              <CrmTable schemaName="Outgoing"></CrmTable>
            </TabPanel>
            <TabPanel>
              <CrmTable schemaName="Exception"></CrmTable>
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
