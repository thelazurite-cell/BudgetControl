import { useState } from "react";
import { NotificationService } from "../service/NotificationService";
import { DataService } from "../service/DataService";
import { NotificationProps } from "../data/NotificationProps";
import { randstring } from "../../api/String.helpers";
import { DataTransfer } from "../../api/DataTransfer";

export function DataActionBar({ children }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState("Submitting...");
  const [ariaLive, setAriaLive] = useState("off");
  const [details, setDetails] = useState({ errors: [], messages: [] });

  const handleSubmit = (schemaName, cb) => {
    setIsSubmitting(true);
    setDescription("Submitting");
    setAriaLive("assertive");

    const pendingCommits = DataService.schemaCache[schemaName].pendingCommits;
    const api = new DataTransfer(DataService.authToken);

    performInserts(pendingCommits, api, schemaName);
    performUpdates(pendingCommits, api, schemaName);
    performDeletes(pendingCommits, api, schemaName);

    // Instead of making a real request, we mock it with a timer
    setTimeout(() => {
      const isError = details.errors.length > 0;
      setSuccess(!isError);

      const notification = new NotificationProps(
        `Changes Saved${isError ? " With Errors" : ""}`,
        ""
      );

      const test = JSON.stringify(details.errors);
      console.log(test);
      notification.buttons = isError ? [{ text: "Show Info" }] : [];
      notification.openPanel = isError;
      notification.onButtonClick = (text) => {
        alert(test);
      };

      NotificationService.add(notification);

      setSuccess(!isError);
      setDescription("Submitted!");
      setAriaLive("off");

      // To make submittable again, we reset the state after a bit so the user gets completion feedback
      setTimeout(() => {
        setIsSubmitting(false);
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

  function performInserts(pendingCommits, api, schemaName) {
    if (pendingCommits.insert && pendingCommits.insert.length > 0) {
      pendingCommits.insert.forEach((itm) => {
        api.insert(
          { type: schemaName, data: itm },
          (result) => {
            const messages = details.messages;
            messages.push(result);
            details.messages = messages;

            const cacheName = DataService.getInsertCacheName(schemaName);
            const use = pendingCommits.insert;
            use.splice(use.indexOf(itm), 1);
            localStorage.setItem(cacheName, JSON.stringify(use));

            setDetails(details);
          },
          (err) => {
            const errors = details.errors;
            errors.push(err);
            details.errors = errors;
            setDetails(details);
          }
        );
      });
    }
  }

  function performUpdates(pendingCommits, api, schemaName) {
    if (pendingCommits.update && pendingCommits.update.length > 0) {
      pendingCommits.update.forEach((itm) => {
        api.update(
          { type: schemaName, id: itm.id, data: itm },
          (result) => {
            const messages = details.messages;
            messages.push(result);
            details.messages = messages;

            const cacheName = DataService.getUpdateCacheName(schemaName);
            const use = pendingCommits.update;
            use.splice(use.indexOf(itm), 1);
            localStorage.setItem(cacheName, JSON.stringify(use));

            setDetails(details);
          },
          (err) => {
            const errors = details.errors;
            errors.push(err);
            details.errors = errors;
            setDetails(details);
          }
        );
      });
    }
  }

  function performDeletes(pendingCommits, api, schemaName) {
    if (pendingCommits.delete && pendingCommits.delete.length > 0) {
      pendingCommits.delete.forEach((itm) => {
        api.deleteRecord(
          { type: schemaName, id: itm.id },
          (result) => {
            const messages = details.messages;
            messages.push(result);
            details.messages = messages;

            const cacheName = DataService.getDeleteCacheName(schemaName);
            const use = pendingCommits.delete;
            use.splice(use.indexOf(itm), 1);
            localStorage.setItem(cacheName, JSON.stringify(use));

            setDetails(details);
          },
          (err) => {
            const errors = details.errors;
            errors.push(err);
            details.errors = errors;
            setDetails(details);
          }
        );
      });
    }
  }
}
