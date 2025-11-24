interface PanelControllerProps {
  togglePanel: () => void;
  isOpen: boolean;
}

const getImageSrc = (isOpen: boolean) => {
  if (isOpen) return "/panel/right_panel_close.svg";
  return "/panel/right_panel_open.svg";
};

const getImageAlt = (isOpen: boolean) => {
  if (isOpen) return "Close";
  return "Open";
};

function PanelController({ togglePanel, isOpen }: PanelControllerProps) {
  const imageSrc = getImageSrc(isOpen);
  const imageAlt = getImageAlt(isOpen);

  return (
    <button onClick={togglePanel} type="button" className={`fixed z-50 ${isOpen ? "right-80" : "right-0"}`}>
      <img src={imageSrc} alt={imageAlt} />
    </button>
  );
}

export default PanelController;
