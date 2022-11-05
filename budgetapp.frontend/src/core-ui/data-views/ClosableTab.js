import { Button, Tab } from "@carbon/react";
import { CloseOutline } from "@carbon/icons-react";
import "../css/ClosableTab.css";

export function ClosableTab(props) {
  return (
    <div>
      <Tab id="terms-tab" className="settings-tab" label="Terms">
        Terms
      </Tab>
      <Button class="cds--tab--close-btn">
        <CloseOutline />
      </Button>
    </div>
  );
}
