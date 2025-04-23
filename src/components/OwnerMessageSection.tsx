import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

function OwnerMessageSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Message From Our Founder
            </h2>
            <Separator className="mx-auto w-24 bg-blue-600 h-1" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/3">
              <div className="relative rounded-full overflow-hidden w-64 h-64 mx-auto border-4 border-gray-100 shadow-lg">
                <Image
                  src="/owner.jpg"
                  alt="Dr. Rajesh Patel - Founder, Drushti Eye Care"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-bold text-lg">Dr. Rajesh Patel</h3>
                <p className="text-gray-600">Founder & Chief Optometrist</p>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="bg-gray-50 p-8 rounded-lg relative">
                {/* Quotation mark */}
                <div className="absolute top-4 left-4 text-gray-200 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.04 4.171c0 0-.134.049-.335.123-.33.12-.361.152-.583.247-.226.099-.475.21-.692.331-.214.119-.419.26-.618.402-.206.131-.375.28-.529.425-.161.131-.31.281-.451.431-.135.155-.261.305-.358.467-.106.153-.199.312-.278.465-.087.145-.169.29-.225.434-.078.133-.118.276-.171.412-.028.08-.042.158-.06.237a2.5 2.5 0 1 0 .002 4.507v.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5v-5C10 11.57 8.43 10 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L21.04 4.171c0 0-.134.049-.335.123-.33.12-.361.152-.583.247-.226.099-.475.21-.692.331-.214.119-.419.26-.618.402-.206.131-.375.28-.529.425-.161.131-.31.281-.451.431-.135.155-.261.305-.358.467-.106.153-.199.312-.278.465-.087.145-.169.29-.225.434-.078.133-.118.276-.171.412-.028.08-.042.158-.06.237a2.5 2.5 0 1 0 .002 4.507v.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5v-5c0-1.93-1.57-3.5-3.5-3.5z"></path>
                  </svg>
                </div>

                <p className="text-gray-700 mb-4 relative z-10">
                  Welcome to Drushti Eye Care! Since establishing our first
                  store in Kudal in 2010, our mission has been simple: to
                  provide quality eyewear that enhances both vision and
                  appearance, all at affordable prices.
                </p>
                <p className="text-gray-700 mb-4">
                  With over 20 years of experience in optometry, I understand
                  the importance of clear vision in everyday life. That's why we
                  not only offer stylish frames but also ensure precision in
                  every prescription lens we craft.
                </p>
                <p className="text-gray-700">
                  At Drushti Eye Care, we treat every customer as family. Your
                  satisfaction and eye health are our priorities, and we're
                  committed to providing personalized service that meets your
                  unique needs. I invite you to visit our store and experience
                  the difference that quality eyecare can make.
                </p>

                <div className="mt-6">
                  <Image
                    src="/logo2.png"
                    alt="Dr. Rajesh Patel's Signature"
                    width={150}
                    height={60}
                    className="ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerMessageSection;
