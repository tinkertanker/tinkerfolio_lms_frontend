import Popup from "reactjs-popup";

const CustomPopup = ({ trigger, onOpen, onClose, children, contentStyle }) => {
  return (
    <Popup
      trigger={trigger}
      onOpen={onOpen}
      onClose={onClose}
      contentStyle={contentStyle}
      modal
      overlayStyle={{ background: "rgba(0,0,0,0.4)" }}
    >
      {children}
    </Popup>
  );
};

// <button className="mt-8 mr-4 py-1 px-2 bg-gray-500 text-sm text-white rounded hover:bg-gray-600">Add Task</button>

export default CustomPopup;
