import React, { useState, useEffect } from "react";
import { ToastNotification, Button, Content } from "@carbon/react";

import "./css/NotificationManager.css";
import { NotificationService } from "./service/NotificationService";

export default function NotificationManager() {
  let [notifications, setNotifications] = useState({
    items: [...NotificationService.items],
  });

  useEffect(() => {
    function notificationUpdate() {
      // console.log(NotificationService.items);
      setNotifications({
        items: [...NotificationService.items],
      });
    }
    NotificationService.createListener(
      "NotificationManager",
      notificationUpdate
    );
  });

  return (
    <div className="notification-manager">
      {notifications.items.length > 0 ? (
        <>
          <Button
            id="clear-all"
            className="notification-ui-button"
            label="Clear all"
            onClick={() => NotificationService.clearAll()}
          >
            Clear all
          </Button>
          <Content className="notification-ui-content">
            {notifications.items.map((notification) => {
              const key = notification.key;

              function onClose(e) {
                // console.log(e);
                NotificationService.remove(key);
              }

              return (
                <>
                  <ToastNotification
                    key={key}
                    className="notification-ui-item"
                    {...notification.props}
                    onClick={(e) => onClose(e)}
                  ></ToastNotification>
                  {(notification.buttons || []).map((button, index) => {
                    return (
                      <Button
                        key={index}
                        className="notification-ui-item--button"
                        onClick={() => notification.onButtonClick(button.text)}
                      >
                        {button.text}
                      </Button>
                    );
                  })}
                </>
              );
            })}
          </Content>
        </>
      ) : (
        <Content className="notification-ui-content no-messages">
          <span>No notifications</span>
        </Content>
      )}
    </div>
  );
}
