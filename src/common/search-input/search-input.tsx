// 3rd party libraries
import React, { ChangeEvent,  ChangeEventHandler,  KeyboardEventHandler,  ReactElement} from 'react';
import classNames from 'classnames';



export interface Props<T> {
  value: T;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string;
  iconClasses?: string;
  showIcon?: boolean;
}

function SearchInput<T extends string | number>(
  props: Props<T>
): ReactElement<any, any> | null {
  // State
  const [hasFocus, setHasFocus] = React.useState(false);

  return (
    <label
      style={{ height: 40 }}
      className={classNames(
        'border rounded-xl py-2 px-3 font-medium shadow-sm flex flex-row items-center gap-2 cursor-text',
        {
          'border-neutral-500 shadow': hasFocus,
          'border-neutral-200': !hasFocus,
        }
      )}
    >
      {props.showIcon && (
        <i className="ri-search-2-line text-xl"></i>
      )}

      <input
        onBlur={() => setHasFocus(false)}
        onFocus={() => setHasFocus(true)}
        id="search-input"
        type="text"
        placeholder={props.placeholder}
        className={`outline-none w-full text-neutral-500`}
        onInput={props.onChange}
        value={props.value}
      />
    </label>
  );
}

SearchInput.defaultProps = {
  iconClasses: `w-5 mr-2 fill-gray-500`,
  showIcon: true,
  placeholder: 'Søg..',
};

export default SearchInput;
