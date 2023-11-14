// 3rd party libraries
import { FC } from 'react'

// Workspace libraries
import { InputWithLabel as SharedInputWithLabel, IInputWithLabelProps } from '@project/ui/input-with-label'



export const InputWithLabel: FC<IInputWithLabelProps> = (props) => {

  console.log()

  return <SharedInputWithLabel {...props} />
}

InputWithLabel.defaultProps = {

  labelClassName: 'text-neutral-500 text-sm font-medium',
  borderClassName: 'border-slate focus-within:border-black rounded-xl',
  inputClassName: 'text-black',
  inputContainerClassName: 'px-3 py-2 gap-3'
}