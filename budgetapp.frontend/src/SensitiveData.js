import React, { useContext, createContext, useState } from "react";
import { Cookie } from "./auth/Cookie";

const sensitiveDataContext = createContext();

export function ProvideSensitiveData({ children }) {
  const sensitiveToggle = useProvideSensitiveData();
  return (
    <sensitiveDataContext.Provider value={sensitiveToggle}>
      {children}
    </sensitiveDataContext.Provider>
  );
}

export function useSensitiveData() {
  return useContext(sensitiveDataContext);
}

function useProvideSensitiveData() {
  const privacyMode = Cookie.get("privacyMode");
  console.log(privacyMode);
  const [showSensitiveData, setShowSensitiveData] = useState(
    privacyMode.length > 0 ? privacyMode === "true" : true
  );

  const toggleSensitiveData = () => {
    console.log(showSensitiveData);
    Cookie.set("privacyMode", !showSensitiveData);
    setShowSensitiveData(!showSensitiveData);
  };

  return {
    showSensitiveData,
    toggleSensitiveData,
  };
}
