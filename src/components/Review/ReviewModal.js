"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiX, FiUpload, FiCamera, FiCheckCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import apiClient from "./../../api/client";
import Image from "next/image";

const ReviewModal = ({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmit,
  user,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;
    // const maxImages = 5;

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload valid images (JPEG, PNG, WebP)");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Each image should be less than 5MB");
        return;
      }
    }

    // if (imageUrls.length + files.length > maxImages) {
    //   toast.error(`Maximum ${maxImages} images allowed`);
    //   return;
    // }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("image", file);
    });

    try {
      setUploadingImage(true);

      const response = await apiClient.post(
        "/upload/uploadMultiple",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log("first iamge", response);
      if (response.ok) {
        // setImageUrls((prev) => [...prev, ...response.data]);
        toast.success("Images uploaded successfully!");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please add rating & review");
      return;
    }

    if (comment.length < 5) {
      toast.error("Review should be at least 5 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewPayload = {
        rating,
        comment,
        userId: user?.id,
        productId,
        // image: imageUrl || null,
        image: imageUrls?.length > 0 ? imageUrls : null,
      };

      await onReviewSubmit(reviewPayload);

      // Reset form
      setRating(0);
      setComment("");
      setImageFiles(null);
      setImageUrls("");

      onClose();
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      handleImageUpload(files);
    }
  };

  const removeImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    if (imageUrls.length <= 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-primary">
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative z-10 w-full max-w-md md:max-w-xl max-h-[90vh] bg-linear-to-br from-amber-50 to-white rounded-3xl shadow-2xl overflow-hidden border bg-white border-amber-100"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-400 via-amber-500 to-yellow-400 z-20" />

          <div className="overflow-y-auto scrollbar-hide max-h-[calc(90vh-2px)]">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <HiOutlineSparkles className="text-amber-500 text-xl" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Share Your Experience
                    </h2>
                  </div>
                  <p className="text-sm text-gray-800">
                    Reviewing:{" "}
                    <span className="font-semibold text-amber-700">
                      {productName}
                    </span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                >
                  <FiX className="text-xl text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Your Rating
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1.5 cursor-pointer transform transition-transform hover:scale-110 active:scale-95"
                      >
                        <FiStar
                          className={`text-3xl transition-all duration-200 ${
                            star <= (hoverRating || rating)
                              ? "text-amber-500 fill-amber-500 drop-shadow-md"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600 min-w-10">
                      {rating ? `${rating}.0` : "0.0"}
                    </span>
                    <span className="text-sm text-gray-500">/ 5.0</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Add Photos (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="relative inline-block">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-amber-200 shadow-md">
                      <Image
                        src={imageUrl}
                        alt="Review"
                        fill
                        className="object-cover"
                        sizes="(max-width: 128px) 100vw, 128px"
                      />
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 cursor-pointer"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full h-32 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-amber-600 font-medium">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-amber-100 rounded-full">
                          <FiCamera className="text-2xl text-amber-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-500">
                          JPEG, PNG, WebP (max 5MB)
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div> */}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Add Photos (Optional){" "}
                  {imageUrls.length > 0 && `(${imageUrls.length}/5)`}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple // Add this attribute
                />

                {imageUrls.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-amber-200 shadow-md">
                          <Image
                            src={url}
                            alt={`Review ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 128px) 100vw, 128px"
                          />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 cursor-pointer"
                        >
                          <FiX className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {imageUrls.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full h-32 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-amber-600 font-medium">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-amber-100 rounded-full">
                          <FiUpload className="text-2xl text-amber-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {imageUrls.length === 0
                            ? "Upload images"
                            : "Add more images"}
                        </span>
                        <span className="text-xs text-gray-500">
                          JPEG, PNG, WebP (max 5MB each)
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Your Review
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about the product... What did you like? How was your experience?"
                    className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {comment.length}/500
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-200 pt-4 pb-2 -mx-6 px-6 border-t border-amber-100">
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !rating ||
                      !comment.trim() ||
                      uploadingImage ||
                      comment.length < 5
                    }
                    className="flex-1 py-3 px-4 font-semibold text-gray-600 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent text-gray-600 rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-lg text-gray-600" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Your review helps others make better decisions
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
