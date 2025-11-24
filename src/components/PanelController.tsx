interface PanelControllerProps {
  togglePanel: () => void;
  isOpen: boolean;
}

function PanelController({ togglePanel, isOpen }: PanelControllerProps) {
  return (
    <button onClick={togglePanel} type="button" className={`fixed z-50 ${isOpen ? "right-80" : "right-0"}`}>
      <img
        src={isOpen ? "/panel/right_panel_close.svg" : "/panel/right_panel_open.svg"}
        alt={isOpen ? "Close" : "Open"}
      />
    </button>
  );
}

export default PanelController;
