import React, { useState } from "react";
import { MapPin, Star, Award, Users, Clock, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/lovable/avatar";
import { Progress } from "@/components/ui/lovable/progress";
import { Badge } from "@/components/ui/lovable/badge";
import { Card, CardContent } from "@/components/ui/lovable/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/lovable/accordion";
import useAuth from "@/auth/useAuth";
import ReviewModal from "../ReviewModal";
import { Info, ListChecks, BookOpen } from "lucide-react";
import { sanitizeHtml } from '@/utils/sanitize';

const ProductDetailSections = ({ product, artisan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const cleanHTML = (html) => html?.replace(/<p>(?:\s|&nbsp;)*<\/p>/g, "");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Ratings data setup
  const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  product?.reviews?.forEach((review) => {
    ratingsCount[review.rating]++;
  });

  const totalReviews = product?.reviews?.length || 0;
  const averageRating = totalReviews
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const ratingData = [5, 4, 3, 2, 1].map((r) => {
    const count = product?.reviews?.filter((rev) => rev.rating === r).length;
    const percentage = totalReviews
      ? Math.round((count / totalReviews) * 100)
      : 0;
    return { rating: r, percentage };
  });

  const sections = [
    product?.details,
    product?.specification,
    product?.specification2,
  ].filter(Boolean);

  return (
    <div className="mt-8 w-full">
      <Accordion
        type="multiple"
        defaultValue={["product-info", "specifications", "artisan", "heritage"]}
        className="mt-8 space-y-4"
      >
        {/* Product Info */}
        <AccordionItem value="product-info">
          <AccordionTrigger className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-lg font-semibold transition">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-600" />
              <span>More About the Product</span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className={`grid gap-6 mt-4 grid-cols-1`}>
              {sections.map((html, idx) => (
                <div
                  key={idx}
                  className="bg-white/50 rounded-2xl p-6 shadow-cultural prose max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Specifications */}
        {(product?.size || product?.weight || product?.usage) && (
          <AccordionItem value="specifications">
            <AccordionTrigger className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-lg font-semibold transition">
              <span>Specifications</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="shadow-sm border rounded-2xl bg-white/50">
                <CardContent className="p-6 space-y-4">
                  {product?.size && (
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>📏 Size</span>
                      <span>{product.size}</span>
                    </div>
                  )}
                  {product?.weight && (
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>⚖️ Weight</span>
                      <span>{product.weight}</span>
                    </div>
                  )}
                  {product?.usage && (
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>🛠️ Usage</span>
                      <span>{product.usage}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Artisan */}
        <AccordionItem value="artisan">
          <AccordionTrigger className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-lg font-semibold transition">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span>Meet the Artisan</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="shadow-cultural bg-white mt-4">
              <CardContent className="p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <img
                    src={artisan?.image}
                    alt={artisan?.fullName}
                    className="w-full h-auto max-h-80 md:max-h-[400px] object-contain rounded-2xl"
                  />

                  <div className="text-artisan-foreground">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">
                      {artisan?.fullName}
                    </h3>
                    <div className="space-y-4">
                      <p className="leading-relaxed">
                        {artisan?.profileDescription}
                      </p>
                      <p className="leading-relaxed">
                        {product?.artisanInfo?.artisanDescription}
                      </p>
                      <div className="space-y-3 pt-4">
                        {artisan?.awardsRecognition?.length > 0 &&
                          artisan?.awardsRecognition?.map((award, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3"
                            >
                              <Award className="h-5 w-5 shrink-0" />
                              <span>{award}</span>
                            </div>
                          ))}
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 shrink-0" />
                          <span>Trained Artisans & Community Leader</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 shrink-0" />
                          <span>
                            {artisan?.experience}+ years of experience
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="heritage">
          <AccordionTrigger className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-lg font-semibold transition">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <span>Heritage Story</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              <Card className="shadow-cultural bg-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-heritage-foreground mb-6">
                    The Legacy of Bundelkhand
                  </h3>
                  <div className="space-y-4 text-heritage-foreground/90">
                    <p>
                      Bundelkhand, a historic region in central India, has been
                      renowned for its exquisite pottery for over 500 years.
                      This ceramic vase represents the culmination of
                      generations of artistic heritage, where each piece tells a
                      story of cultural pride and traditional craftsmanship.
                    </p>
                    <p>
                      Our artisans use the same techniques that have been passed
                      down through families for centuries, working with local
                      clay and natural pigments to create pieces that are not
                      just decorative items, but vessels of living history.
                    </p>
                    <div className="flex items-center space-x-4 pt-4">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">
                        Handcrafted in Bundelkhand, Uttar Pradesh
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-cultural bg-white">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 text-lg">
                    Cultural Impact
                  </h4>
                  <div className="space-y-4">
                    {/* Artisan Families */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Artisan families supported
                      </span>
                      <span className="font-semibold text-gray-900">15+</span>
                    </div>

                    {/* Tradition Preserved */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Years of tradition preserved
                      </span>
                      <span className="font-semibold text-gray-900">500+</span>
                    </div>

                    {/* Sustainable Materials */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Sustainable materials used
                      </span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>

                    {/* New Data: Fair Trade Practices */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Fair trade compliance
                      </span>
                      <span className="font-semibold ">Yes</span>
                    </div>

                    {/* New Data: Local Employment */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Local employment created
                      </span>
                      <span className="font-semibold text-gray-900">
                        120+ jobs
                      </span>
                    </div>

                    {/* New Data: Carbon Footprint */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Carbon footprint reduction
                      </span>
                      <span className="font-semibold text-emerald-600">
                        35%
                      </span>
                    </div>

                    {/* Progress Bar for Sustainability Score */}
                    <div>
                      <p className="text-gray-600 mb-1">Sustainability Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-500 mt-1">
                        90/100
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section id="reviews" className="mt-12">
        <h2 className="text-2xl  font-semibold mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          <Card className="shadow-cultural bg-white">
            <CardContent className="p-6">
              <h3 className="text-2xl font-medium mb-4">
                {averageRating.toFixed(1)} out of 5
              </h3>
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground mb-6">
                Based on {product?.reviews?.length} reviews
              </p>
              <div className="space-y-3">
                {ratingData.map(({ rating, percentage }) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-8">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {product?.reviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {review?.name
                            ? review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <Badge
                              variant="outline"
                              className="text-xs border-green-500 text-green-600"
                            >
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                  {review.images && (
                    <div className="flex space-x-2 mt-4">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Review"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {user && (
          <button
            onClick={openModal}
            className="w-36 rounded-full bg-accent py-3 text-white font-medium mt-4"
          >
            Write a review
          </button>
        )}
        <ReviewModal isOpen={isModalOpen} onClose={closeModal} />
      </section>
    </div>
  );
};

export default ProductDetailSections;
