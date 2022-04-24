import "./css/Nav.css";

import {
  Notification,
  Menu,
  Logout,
  Settings,
  View,
  ViewOff,
} from "@carbon/icons-react";
import React, { useEffect, useState, createContext, useContext } from "react";
import { useAuth } from "../auth/Auth";
import { useHistory, Link } from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  Tag,
  useTheme,
  Theme,
} from "@carbon/react";
import { FilterTypeEnum } from "../api/data-query/filter-type.enum";
import { Query } from "../api/data-query/query";
import { QueryGroup } from "../api/data-query/query-group";
import { DataTransfer } from "../api/DataTransfer";
import { NotificationService } from "./service/NotificationService";
import NotificationManager from "./NotificationManager";
import { NavService } from "./service/NavService";
import { useSensitiveData } from "../SensitiveData";

export default function Nav() {
  const { theme } = useTheme();
  let [actionsVisible, setActionsVisible] = useState(false);
  let [notificationsVisible, setNotificationsVisible] = useState(false);
  let [actionsExpanded, setActionsExpanded] = useState(false);
  let [notificationsExpanded, setNotificationsExpanded] = useState(false);
  let [username, setUsername] = useState("");
  let [notificationCount, setNotificationCount] = useState(0);

  let auth = useAuth();
  let sensitive = useSensitiveData();
  let history = useHistory();

  useEffect(() => {
    function notificationUpdate() {
      setActionsExpanded(false);
      setNotificationsExpanded(true);
    }

    function notificationCountUpdate() {
      setNotificationCount(NotificationService.items.length);
    }

    NotificationService.createListener("Nav", notificationCountUpdate);
    NavService.createListener("Nav", notificationUpdate);
  });

  useEffect(() => {
    if (auth.user && auth.user.length > 0) {
      setActionsVisible(true);
      setNotificationsVisible(true);

      let group = new QueryGroup();
      group.comparisonType = FilterTypeEnum.byId;
      let query = new Query();
      query.fieldValue = auth.user;
      group.queries.push(query);

      const api = new DataTransfer(auth.token);

      api.find(
        "User",
        group,
        (response) => {
          if (response && response.data) {
            var currentUser = response.data.pop();
            setUsername(currentUser.username);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [auth]);

  function signout() {
    auth.signout();
    let { from } = { from: { pathname: "/login" } };
    history.replace(from);

    setActionsVisible(false);
    setNotificationsVisible(false);
    setActionsExpanded(false);
    setNotificationsExpanded(false);
    setUsername("");
  }

  return (
    // <Theme theme={theme}>
    <Header aria-label="CRM">
      <HeaderName href="#" prefix="CRM">
        [Platform]
      </HeaderName>
      <HeaderGlobalBar>
        {/* <HeaderGlobalAction
          aria-label="Search"
          label="Search"
          //   onClick={action("search click")}
        >
          <Search20 />
        </HeaderGlobalAction> */}
        {username.length > 0 ? (
          <>
            <HeaderGlobalAction
              className="username"
              aria-label="username"
              label="Login"
            >
              <label>{username}</label>
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Toggle Privacy Mode"
              label="ToggleSensitiveData"
              onClick={() => sensitive.toggleSensitiveData()}
            >
              {sensitive.showSensitiveData ? (
                <View id="sensitive-data-on" />
              ) : (
                <ViewOff id="sensitive-data-off" />
              )}
            </HeaderGlobalAction>
          </>
        ) : null}
        {notificationsVisible ? (
          <HeaderGlobalAction
            aria-label="Notifications"
            onClick={(evt) => {
              setActionsExpanded(false);
              setNotificationsExpanded(!notificationsExpanded);
            }}
          >
            {notificationCount > 0 ? (
              <Tag type="blue" title="Clear Filter">
                {notificationCount >= 99 ? "99+" : notificationCount}
              </Tag>
            ) : (
              <Notification />
            )}
          </HeaderGlobalAction>
        ) : null}
        {actionsVisible ? (
          <HeaderGlobalAction
            aria-label="Actions"
            isActive
            onClick={(evt) => {
              setActionsExpanded(!actionsExpanded);
              setNotificationsExpanded(false);
            }}
            tooltipAlignment="end"
          >
            <Menu />
          </HeaderGlobalAction>
        ) : null}
      </HeaderGlobalBar>
      <HeaderPanel aria-label="Header Panel" expanded={actionsExpanded}>
        <Switcher aria-label="Switcher Container">
          <SwitcherItem
            id="log-out"
            aria-label="Log out"
            onClick={() => signout()}
          >
            <Logout /> Log Out
          </SwitcherItem>
          <SwitcherDivider />
          <li className="route-link">
            <Link to="/settings">
              <Settings /> Settings
            </Link>
          </li>
          <SwitcherDivider />
          <li className="route-link">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="route-link">
            <Link to="/transactions">Transactions</Link>
          </li>
        </Switcher>
      </HeaderPanel>
      <HeaderPanel aria-label="Header Panel" expanded={notificationsExpanded}>
        {/* transition looks cleaner with this in place */}
        <div style={{ display: notificationsExpanded ? "inline" : "none" }}>
          <NotificationManager className="notification-manager" />
        </div>
      </HeaderPanel>
    </Header>
    // </Theme>
  );
}
