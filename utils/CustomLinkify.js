import Linkify from "react-linkify";

const CustomLinkify = ({ children }) => {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a
          className="text-blue-500 hover:underline"
          target="blank"
          href={decoratedHref}
          key={key}
        >
          {decoratedText}
        </a>
      )}
    >
      {children}
    </Linkify>
  );
};

export default CustomLinkify;
