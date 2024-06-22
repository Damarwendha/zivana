import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import TextArea from "@/app/components/inputs/TextArea";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function FeedbackForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(data: any) {
    setIsLoading(true);
    axios
      .post("/api/report", data)
      .then((res) => {
        toast.success("Pesan Berhasil Terkirim!");
      })
      .catch((err) => {
        toast.error("Oops! gagal");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <Heading title="Berikan Saran dan Masukan" />
      </div>

      <div className="space-y-4">
        <TextArea
          label="Pesan"
          register={register}
          id="message"
          required
          errors={errors}
        />
      </div>

      <div className="mt-4">
        <Button
          label={isLoading ? "Memproses..." : "Kirim"}
          type="submit"
          disabled={isLoading}
          onClick={() => {}}
        />
      </div>
    </form>
  );
}

export default FeedbackForm;
