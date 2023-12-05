import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@libs/use-restricted-input';
import React from 'react';
import { TextInput, TextInputProps } from './TextInput';

export type NumberInputProps = Omit<TextInputProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  onChange,
  inputMode = type === 'decimal' ? 'decimal' : 'numeric',
  ...props
}: NumberInputProps) {
  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts,
    maxDecimalPoints,
    onChange,
  });
  return (
    <TextInput
      {...props}
      type="text"
      inputProps={{
        inputMode,
        pattern: '[0-9.]*',
      }}
      {...handlers}
    />
  );
}
