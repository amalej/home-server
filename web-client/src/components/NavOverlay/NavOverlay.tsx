import React from "react";
import TopNav from "../TopNav/TopNav";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

interface NavOverlayProps {
  child: ReactJSXElement;
}

function NavOverlay({ child }: NavOverlayProps) {
  return (
    <div>
      <TopNav />
      {child}
    </div>
  );
}

export default NavOverlay;
