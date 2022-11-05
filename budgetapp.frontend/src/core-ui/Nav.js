import "./css/Nav.scss";

import { Notification, Menu, Logout, View, ViewOff } from "@carbon/icons-react";
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
  SkeletonText,
} from "@carbon/react";
import { FilterTypeEnum } from "../api/data-query/filter-type.enum";
import { Query } from "../api/data-query/query";
import { QueryGroup } from "../api/data-query/query-group";
import { DataTransfer } from "../api/DataTransfer";
import { NotificationService } from "./service/NotificationService";
import NotificationManager from "./NotificationManager";
import { NavService } from "./service/NavService";
import { useSensitiveData } from "../SensitiveData";
import { WorkspaceTabService } from "../dashboard/service/WorkspaceTabService";
import { DataViewManager } from "./data-views/DataViewManager";
import Settings from "../settings/Settings";

export default function Nav() {
  const { theme } = useTheme();
  let [actionsVisible, setActionsVisible] = useState(false);
  let [notificationsVisible, setNotificationsVisible] = useState(false);
  let [actionsExpanded, setActionsExpanded] = useState(false);
  let [notificationsExpanded, setNotificationsExpanded] = useState(false);
  let [navItemsLoaded, setNavItemsLoaded] = useState(false);
  let [navItems, setNavItems] = useState({ data: [] });
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

      let navGroup = new QueryGroup();
      group.comparisonType = FilterTypeEnum.equals;
      let navQuery = new Query();
      navQuery.fieldValue = ["true"];
      navQuery.fieldName = "viewShown";
      navQuery.comparisonType = FilterTypeEnum.equals;
      navGroup.queries.push(navQuery);

      api.find(
        "Schema",
        navGroup,
        (response) => {
          navItems.data = response.data;
          setNavItems(navItems);
          setNavItemsLoaded(true);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [auth, navItems]);

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
              className="user-btn"
              label="User Preferences"
              aria-label={`User Preferences for ${username}`}
              onClick={() => {
                const id = new Date().valueOf();
                WorkspaceTabService.insertTab({
                  id: id,
                  tab: "Preferences",
                  component: (
                    <div>
                      <p>Preferences</p>
                    </div>
                  ),
                  closeable: true,
                });
              }}
            >
              <HeaderName
                prefix=""
                className="username"
                aria-label="username"
                label="Login"
              >
                {username}
              </HeaderName>
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Toggle Privacy Mode"
              label="Toggle Privacy Mode"
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
            aria-label="Logout"
            onClick={() => signout()}
          >
            <Logout /> Log Out
          </SwitcherItem>
          <SwitcherDivider />
          <SwitcherItem
            aria-label="Settings"
            key={() => new Date().valueOf()}
            onClick={() => {
              const id = new Date().valueOf();
              WorkspaceTabService.insertTab({
                id: id,
                tab: "Settings",
                component: (
                  <div>
                    <Settings />
                  </div>
                ),
                closeable: true,
              });
            }}
          >
            Settings
          </SwitcherItem>
          <SwitcherDivider />
          {navItemsLoaded ? (
            <>
              {navItems.data.map((itm) => {
                const nitm = JSON.parse(JSON.stringify(itm));
                return (
                  <SwitcherItem
                    key={`link-${
                      nitm.viewFriendlyName
                    }-${new Date().valueOf()}`}
                    aria-label={itm.fieldFriendlyName}
                    onClick={() => {
                      const id = `nitm-${
                        nitm.viewFriendlyName
                      }-${new Date().valueOf()}`;
                      WorkspaceTabService.insertTab({
                        id: id,
                        tab: nitm.viewFriendlyName,
                        forceReload: nitm.viewForceReload,
                        component: (
                          <>
                            <div id={`${id}-component-div`}>
                              <DataViewManager
                                id={`${id}-component`}
                                schemaName={nitm.schemaName}
                              />
                            </div>
                          </>
                        ),
                        closeable: true,
                      });
                    }}
                  >
                    {nitm.viewFriendlyName}
                  </SwitcherItem>
                );
              })}
            </>
          ) : (
            <SwitcherItem>
              <SkeletonText />
            </SwitcherItem>
          )}
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
