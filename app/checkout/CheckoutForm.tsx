"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import Input from "../components/inputs/Input";
import CustomCheckBox from "../components/inputs/CustomCheckBox";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import {
  ImageType,
  UploadedImageType,
} from "../admin/add-products/AddProductForm";
import DropFileContainer from "../components/DropFileContainer";
import { useDropzone } from "react-dropzone";
import { CartProductType } from "../product/[productId]/ProductDetails";
import getLocations from "@/actions/getLocations";
import axios from "axios";
import orderLocations from "@/constants/orderLocation.json";

interface CheckoutFormProps {
  // clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
  cartProducts: CartProductType[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  // clientSecret,
  cartProducts,
  handleSetPaymentSuccess,
}) => {
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [ongkir, setOngkir] = useState(0);
  const formattedPrice = formatPrice(cartTotalAmount + ongkir);

  useEffect(() => {
    // if (!stripe) {
    //   return;
    // }
    // if (!clientSecret) {
    //   return;
    // }
    handleSetPaymentSuccess(false);
  }, [stripe]);

  // DAMAR
  const [previewImage, setPreviewImage] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      // Do something with the files
      setPreviewImage(URL?.createObjectURL(acceptedFiles[0]));
      setValue("image_file", acceptedFiles[0]);
      clearErrors("image_file");
    },
    [clearErrors, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const onSubmit = async (data) => {
    // e.preventDefault();

    // if (!stripe || !elements) {
    //   return;
    // }

    setIsLoading(true);

    // stripe
    //   .confirmPayment({
    //     elements,
    //     redirect: "if_required",
    //   })
    //   .then((result) => {
    //     if (!result.error) {
    //       toast.success("Pembayaran berhasil");

    //       handleClearCart();
    //       handleSetPaymentSuccess(true);
    //       handleSetPaymentIntent(null);
    //     }

    //     setIsLoading(false);
    //   });

    // DAMAR SECTION

    // HANDLE IMAGE
    const newImages = [{ image: data.image_file }];

    console.log("Product Data", data);
    //save product to mongodb
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
  console.log("ong", ongkir);
  useEffect(() => {
    orderLocations.map((o) => {
      locId === o.id ? setOngkir(o.price) : "";
    });
  }, [locId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="payment-form">
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
          className="border-2 p-3 rounded-lg"
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

      {/* <AddressElement
        options={{
          mode: "shipping",
        }}
      /> */}
      <h2 className="mt-4 mb-2 font-semibold">Upload Bukti Transfer</h2>
      <DropFileContainer
        {...getRootProps()}
        handleDeleteImage={() => {
          setPreviewImage("");
          setValue("image_file", "");
        }}
        isDragActive={isDragActive}
        previewImage={previewImage}
      >
        <input
          accept="image/*"
          id="image_file"
          placeholder="Please enter a value"
          type="file"
          {...register("image_file", { required: "*This field is required" })}
          {...getInputProps()}
          //   to fix failed to set value... see more here: https://stackoverflow.com/questions/66876022/setfieldvalue-formik-and-invalidstateerror-failed-to-set-the-value-property
          // value={undefined}
        />
      </DropFileContainer>
      <p className="text-rose-500 mt-1 text-xs">
        {errors?.image_file && (errors?.image_file?.message as string)}
      </p>

      {/* <PaymentElement id="payment-element" options={{ layout: "tabs" }} /> */}
      <div className="py-4 text-xl font-bold text-center text-slate-700">
        Total: {formattedPrice}
      </div>
      <Button
        label={isLoading ? "Memproses" : "Bayar"}
        disabled={isLoading}
        onClick={() => {}}
      />
    </form>
  );
};

export default CheckoutForm;
