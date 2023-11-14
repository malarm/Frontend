// 3rd party libraries
import classNames from 'classnames';
import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

// Workspace libraries
import { InputTypes } from '@thor-frontend/features/real-estate-cards/components/details-sections/work-task-item';



type Props = {
  placeholder: string;
  value: string;
  inputType: string;
  onInputBlur: (e) => void;
  onKeyDown: (e) => void;
  onInputCapture: (e, value: string) => void;
  setEditModeHandler: (e: string) => void;
  editMode: string;
  focusElement: string;
  tdAlignment?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  justifyContent?: string;
  inputTextAlignment?: string;
  reactComponent?: () => JSX.Element;
  onChange: (val: string) => void;
  index?: number;
};

/**
 * Union types not working with forwardRef.
 * Using any type for now. It's being passed as an HTMLInputElement and HTMLTextAreaElement
 * A solution can probably be found somewhere
 */
const WorkTaskItemInput = React.forwardRef<any, Props>((props: Props, ref) => {
  // State
  const [hover, setHover] = React.useState(false);

  const displayHoverContent = () => {
    return (
      <div
        className={classNames('text-base my-3 px-2 z-50', {
          'bg-white': props.index % 2 === 0,
          'bg-neutral-100': props.index % 2 !== 0,
        })}
      >
        <p>{props.value}</p>
      </div>
    );
  };

  return (
    <td className="relative" align={props.tdAlignment}>
      {props.inputType === InputTypes.description_input ? (
        <TextareaAutosize
          ref={ref}
          onKeyDown={(e) => props.onKeyDown(e)}
          onChange={(e) => props.onChange(e.currentTarget.value)}
          onBlur={(e) => props.onInputBlur(e)}
          name={props.inputType}
          onFocusCapture={(e) => props.onInputCapture(e, props.inputType)}
          value={props.value}
          placeholder={props.placeholder}
          className={classNames(
            `w-full px-2 py-3 h-full focus:outline-none rounded-none ${props.inputTextAlignment}`,
            {
              'opacity-0 -z-10 absolute':
                !props.editMode ||
                (props.editMode && props.focusElement !== props.inputType),
              'border border-black z-40 absolute top-0':
                props.focusElement === props.inputType && props.editMode,
            }
          )}
        />
      ) : (
        <input
          onKeyDown={(e) => props.onKeyDown(e)}
          onChange={(e) => props.onChange(e.target.value)}
          ref={ref}
          onBlur={(e) => props.onInputBlur(e)}
          name={props.inputType}
          onFocusCapture={(e) => props.onInputCapture(e, props.inputType)}
          value={props.value}
          placeholder={props.placeholder}
          className={classNames(
            `w-full px-2 py-3 h-12 absolute focus:outline-none rounded-none top-0 ${props.inputTextAlignment}`,
            {
              'opacity-0 -z-10':
                !props.editMode ||
                (props.editMode && props.focusElement !== props.inputType),
              'border border-black z-40':
                props.focusElement === props.inputType && props.editMode,
            }
          )}
        />
      )}

      <div
        onMouseEnter={() => {
          if (props.inputType !== InputTypes.description_input) return;
          if (props.editMode) return;
          setHover(true);
        }}
        onMouseLeave={() => setHover(false)}
        onClick={() => props.setEditModeHandler(props.inputType)}
        className={classNames(
          `flex w-full h-12 my-3 px-2 absolute top-0 text-right ${props.justifyContent}`,
          {
            'opacity-0 -z-10':
              props.editMode && props.focusElement === props.inputType,
            'opacity-0': hover,
            'z-30': !hover,
          }
        )}
      >
        {/* Custom Compoennt or output the value */}
        {props.reactComponent ? (
          <props.reactComponent />
        ) : (
          <p className="text-left h-12 text-base whitespace-nowrap overflow-hidden overflow-ellipsis">
            {props.value}
          </p>
        )}
      </div>
      {/* Both Helps with height with textarea when hovering and when description has focus */}
      {hover && displayHoverContent()}

      {props.editMode &&
        props.focusElement === InputTypes.description_input &&
        props.inputType === InputTypes.description_input &&
        displayHoverContent()}

      {/* Helps with row height in the background */}
      {props.inputType === InputTypes.description_input && !hover && (
        <div
          className={classNames('text-base px-2 h-12 bg-neutral-100 -z-10', {
            'bg-white': props.index % 2 === 0,
            'bg-neutral-100': props.index % 2 !== 0,
            'absolute h-0 top-0':
              props.editMode &&
              props.focusElement === InputTypes.description_input,
          })}
        >
          <p className="opacity-0 ">{props.value}</p>
        </div>
      )}
    </td>
  );
});

WorkTaskItemInput.defaultProps = {
  tdAlignment: undefined,
  justifyContent: 'justify-end',
  inputTextAlignment: 'text-right',
  index: -1,
};

export default WorkTaskItemInput;
