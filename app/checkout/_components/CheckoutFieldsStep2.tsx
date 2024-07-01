import Button from "@/app/components/Button";
import DropFileContainer from "@/app/components/DropFileContainer";
import Heading from "@/app/components/Heading";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface IProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  setValue: UseFormSetValue<FieldValues>;
  onBackStep: () => void;
  clearErrors: UseFormClearErrors<FieldValues>;
  isLoading: boolean;
  setPreviewImg: React.Dispatch<React.SetStateAction<string>>;
  previewImg: string;
}

const LIST_TUJUAN_PEMBAYARAN = [
  {
    account_type: "DANA",
    account_target: "081273312278",
    account_name: " M RAYHAN BILHAQI",
  },
  {
    account_type: "BANK Mandiri",
    account_target: "1790003519159",
    account_name: " M RAYHAN BILHAQI",
  },
];

function CheckoutFieldsStep2({
  errors,
  onBackStep,
  register,
  setValue,
  clearErrors,
  isLoading,
  setPreviewImg,
  previewImg,
}: IProps) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      // Do something with the files
      setPreviewImg(URL?.createObjectURL(acceptedFiles[0]));
      setValue("image_file", acceptedFiles[0]);
      clearErrors("image_file");
    },
    [clearErrors, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <>
      <div className="mb-6">
        <Heading title="Lakukan pembayaran anda dibawah" />
      </div>
      <h2 className="mt-4 mb-2 font-semibold">Bayar ke</h2>
      <select
        className="w-full p-3 border-2 rounded-lg"
        title="account_target"
        id="account_target"
        defaultValue={""}
        {...register("account_target", { required: "*This field is required" })}
      >
        <option value="" label="Pilih salah satu">
          Pilih salah satu
        </option>
        {LIST_TUJUAN_PEMBAYARAN.map((o) => (
          <option
            label={
              o.account_type +
              ", Kirim ke: " +
              o.account_target +
              ", a.n." +
              o.account_name
            }
            key={o.account_target}
            value={o.account_target}
          >
            {o.account_type +
              ", Kirim ke: " +
              o.account_target +
              ", a.n." +
              o.account_name}
          </option>
        ))}
      </select>

      <h2 className="mt-4 mb-2 font-semibold">Upload Bukti Transfer</h2>
      <DropFileContainer
        {...getRootProps()}
        handleDeleteImage={() => {
          setPreviewImg("");
          setValue("image_file", "");
        }}
        isDragActive={isDragActive}
        previewImage={previewImg}
      >
        <input
          accept="image/*"
          id="image_file"
          placeholder="Please enter a value"
          type="file"
          {...register("image_file", { required: "*This field is required" })}
          {...getInputProps()}
        />
      </DropFileContainer>
      <p className="mt-1 text-xs text-rose-500">
        {errors?.image_file && (errors?.image_file?.message as string)}
      </p>

      <div className="flex gap-3 mt-3">
        <Button label={"< Kembali"} type="button" onClick={onBackStep} />
        <Button
          label={isLoading ? "Loading..." : "Checkout"}
          type="submit"
          disabled={isLoading}
          onClick={() => {}}
        />
      </div>
    </>
  );
}

export default CheckoutFieldsStep2;
