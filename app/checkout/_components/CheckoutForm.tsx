"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { useStripe } from "@stripe/react-stripe-js";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import { UploadedImageType } from "../../admin/add-products/AddProductForm";
import { useDropzone } from "react-dropzone";
import { CartProductType } from "../../product/[productId]/ProductDetails";
import orderLocations from "@/constants/orderLocation.json";
import CheckoutFieldsStep1 from "./CheckoutFieldsStep1";
import CheckoutFieldsStep2 from "./CheckoutFieldsStep2";
import Button from "@/app/components/Button";

interface CheckoutFormProps {
  handleSetPaymentSuccess: (value: boolean) => void;
  cartProducts: CartProductType[];
}

function CheckoutForm({
  cartProducts,
  handleSetPaymentSuccess,
}: CheckoutFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger,
    getValues,
    clearErrors,
    watch,
  } = useForm();
  const { cartTotalAmount } = useCart();
  const stripe = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [ongkir, setOngkir] = useState(0);
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState("");

  const formattedPrice = formatPrice(cartTotalAmount + ongkir);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    // HANDLE IMAGE
    const newImages = [{ image: data.image_file }];

    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!newImages || newImages.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image!");
    }

    const handleImageUploads = async () => {
      toast("Menambah Produk, proses...");
      try {
        for (const item of newImages) {
          if (item.image) {
            console.log("Process Started");
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                        color: "",
                        colorCode: "",
                      });
                      console.log("File available at", downloadURL);
                      makeOrder(downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting the download URL", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("Error handling image uploads");
      }
    };

    const makeOrder = async (transferURL: string) => {
      try {
        const newData = {
          address: data.address,
          items: cartProducts,
          transfer_image: transferURL,
          location_id: data.location_id,
          account_target: data.account_target,
        };
        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
        setIsLoading(false);
        handleSetPaymentSuccess(true);
        console.log("submitted data >>", newData);
      } catch (error: any) {
        setIsLoading(false);
        handleSetPaymentSuccess(false);
        throw new Error(error);
      }
    };

    await handleImageUploads();
  };

  const locId = watch("location_id");

  useEffect(() => {
    orderLocations.map((o) => {
      locId === o.id ? setOngkir(o.price) : "";
    });
  }, [locId]);

  useEffect(() => {
    handleSetPaymentSuccess(false);
  }, [stripe]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="payment-form">
      {step === 1 && (
        <CheckoutFieldsStep1
          onNextStep={async () => {
            const isValid = await trigger(["address", "location_id", "name"]);
            if (isValid) {
              setStep(2);
            }
          }}
          errors={errors}
          register={register}
        />
      )}

      {step === 2 && (
        <CheckoutFieldsStep2
          clearErrors={clearErrors}
          errors={errors}
          onBackStep={() => setStep(1)}
          register={register}
          isLoading={isLoading}
          setValue={setValue}
          setPreviewImg={setPreviewImage}
          previewImg={previewImage}
        />
      )}

      <div className="py-4 text-xl font-bold text-center text-slate-700">
        Total: {formattedPrice}
      </div>
    </form>
  );
}

export default CheckoutForm;
