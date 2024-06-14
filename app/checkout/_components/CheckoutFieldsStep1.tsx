import Heading from "@/app/components/Heading";
import orderLocations from "@/constants/orderLocation.json";
import Input from "@/app/components/inputs/Input";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import Button from "@/app/components/Button";

interface IProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onNextStep: () => void;
}

function CheckoutFieldsStep1({ register, errors, onNextStep }: IProps) {
  return (
    <>
      <div className="mb-6">
        <Heading title="Masukkan detail pembayaran anda" />
      </div>
      <h2 className="mb-2 font-semibold">Informasi Pengiriman</h2>
      <div className="flex flex-col gap-3">
        <Input
          label="Nama Lengkap"
          register={register}
          id="name"
          required
          type="text"
          errors={errors}
        />
        <select
          className="p-3 border-2 rounded-lg"
          title="Alamat"
          defaultValue={"9293992"}
          id="location_id"
          {...register("location_id", { required: "*This field is required" })}
        >
          <option value="" label="Pilih lokasi pembayaran">
            Pilih lokasi pembayaran
          </option>
          {orderLocations.map((o) => (
            <option
              label={o.city + ", Biaya ongkir: " + o.price}
              key={o.id}
              value={o.id}
            >
              {o.city}, Biaya ongkir: {o.price}
            </option>
          ))}
        </select>
        <Input
          label="Alamat"
          register={register}
          id="address"
          required
          type="text"
          errors={errors}
        />
      </div>

      <div className="mt-4">
        <Button label={"Selanjutnya"} type="button" onClick={onNextStep} />
      </div>
    </>
  );
}

export default CheckoutFieldsStep1;
