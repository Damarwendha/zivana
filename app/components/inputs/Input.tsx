"use client";

import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  options?: RegisterOptions<FieldValues, string>;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  register,
  errors,
  options,
}) => {
  return (
    <div className="relative w-full">
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required: "*This field is required" } || options)}
        placeholder=""
        type={type}
        className={`
      peer
      w-full
      p-4
      pt-6
      outline-none
      bg-white
      font-light
      border-2
      rounded-md
      transition
      disabled:opacity-70
      disabled:cursor-not-allowed
      ${errors[id] ? "border-rose-400" : "border-slate-300"}
      ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
      `}
      />
      <label
        htmlFor={id}
        className={`absolute
      cursor-text
      text-md
      duration-150
      tranform
      -translate-y-3
      top-5
      z-10
      origin-[0]
      left-4
      peer-placeholder-shown:scale-100
      peer-placeholder-shown:translate-y-0
      peer-focus:scale-75
      peer-focus:-translate-y-4
      ${errors[id] ? "text-rose-500" : "text-slate-400"}
  `}
      >
        {label}
      </label>
      <p className="text-rose-500 mt-1 text-xs">
        {errors[id] && (errors[id]?.message as string)}
      </p>
    </div>
  );
};

export default Input;
