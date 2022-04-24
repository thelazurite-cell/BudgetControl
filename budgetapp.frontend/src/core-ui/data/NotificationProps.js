import { randstring } from "../../api/String.helpers";

export const notificationTypes = {
  error: "error",
  info: "info",
  "info-square": "info-square",
  success: "success",
  warning: "warning",
  "warning-alt": "warning-alt",
};

export class NotificationProps {
  constructor(
    title,
    subtitle,
    caption = "",
    openPanel = false,
    role = "alert",
    kind = notificationTypes.info,
    buttons = []
  ) {
    this.key = randstring();
    this.props.key = randstring();
    this.props.role = role;
    this.props.kind = kind;
    this.props.statusIconDescription = `the status for the notification is ${kind}`;
    this.props.title = title;
    this.props.subtitle = subtitle;
    this.props.caption = caption;
    this.buttons = buttons;
    this.openPanel = openPanel;
  }

  key = "";
  openPanel = false;
  props = {
    key: "",
    kind: notificationTypes.info,
    lowContrast: false,
    role: "alert",
    title: "",
    subtitle: "",
    iconDescription: "The close button for the notification",
    statusIconDescription: "",
    caption: "",
  };
  buttons = [];
  onButtonClick = (text) => console.log(text);
}
