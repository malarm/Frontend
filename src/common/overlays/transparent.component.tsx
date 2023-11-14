type Props = {
  clickHandler?: () => void;
  isOpen?: boolean;
};

const TransparentOverlay = (props: Props) => {
  const isOpen = props.isOpen ?? true;

  return (
    <div
      onClick={props.clickHandler ? () => props.clickHandler() : null}
      className={`fixed bg-black h-full left-0 w-full top-0 ${
        isOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-150 ease-in-out`}
      style={{ zIndex: 500 }}
    />
  );
};

export default TransparentOverlay;
