import "./css/Settings.css";
import React, { useState } from "react";
import {
  Header,
  Button,
  InlineLoading,
  Loading,
  Tabs,
  Tab,
} from "carbon-components-react";
import { Save20, IncompleteCancel20 } from "@carbon/icons-react";
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
                  <IncompleteCancel20 />
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
                    <Save20 />
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
          <Tab id="terms-tab" label="Terms">
            <CrmTable schemaName="Term"></CrmTable>
          </Tab>
          <Tab id="categories-tab" label="Categories">
            <CrmTable schemaName="Category"></CrmTable>
          </Tab>
          <Tab id="expenditures-tab" label="Outgoings">
            <CrmTable schemaName="Outgoing"></CrmTable>
          </Tab>
          <Tab id="exceptions-tab" label="Exceptions">
            <CrmTable schemaName="Exception"></CrmTable>
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
