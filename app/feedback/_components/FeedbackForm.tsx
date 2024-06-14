import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import TextArea from "@/app/components/inputs/TextArea";
import { useForm } from "react-hook-form";

function FeedbackForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    watch,
  } = useForm();

  function onSubmit(data: any) {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <Heading title="Berikan Saran dan Masukan" />
      </div>

      <div className="space-y-4">
        <TextArea
          label="Tanggapan Anda tentang Produk"
          register={register}
          id="feedback_product"
          required
          errors={errors}
        />
        <TextArea
          label="Tanggapan Anda tentang Website"
          register={register}
          id="feedback_website"
          required
          errors={errors}
        />
      </div>

      <div className="mt-4">
        <Button
          // label={isLoading ? "Memproses" : "Kirim"}
          label={"Kirim"}
          // disabled={isLoading}
          onClick={() => {}}
        />
      </div>
    </form>
  );
}

export default FeedbackForm;
