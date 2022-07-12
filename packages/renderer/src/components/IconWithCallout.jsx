  import { Icon, Callout } from "@fluentui/react";
  import { useId, useBoolean } from "@fluentui/react-hooks";

  const IconWithCallout = ({
    iconName = "info",
    content = "This is the tooltip content"
  }) => {
    const calloutId = useId('tooltip');
      const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);

    return (
      <>
        <Icon
          iconName={iconName}
          id={calloutId}
          onMouseEnter={toggleIsCalloutVisible}
          onMouseLeave={toggleIsCalloutVisible}
        />
        {isCalloutVisible && (
          <Callout
            target={`#${calloutId}`}
            style={{
              width: 320,
              padding: '20px 24px',
            }}
            gapSpace={0}
          >
            {content}
          </Callout>
        )}
      </>
    );
}

export default IconWithCallout;
