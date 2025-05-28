import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ContactInfo } from "@/utils/globas";

// FAQ categories and questions
const faqCategories = [
  {
    id: "general",
    name: "General Questions",
    questions: [
      {
        question: "What are your business hours?",
        answer:
          "Our store is open Monday through Saturday from 9:30 AM to 8:00 PM, and on Sundays from 10:00 AM to 4:00 PM.",
      },
      {
        question: "Do I need an appointment to visit your store?",
        answer:
          "While walk-ins are always welcome for frame browsing and general inquiries, we recommend scheduling an appointment for eye examinations and consultations to ensure minimal waiting time.",
      },
      {
        question: "Do you accept insurance?",
        answer:
          "Yes, we accept most major vision insurance plans. Please bring your insurance information during your visit, and we'll help you understand your coverage and benefits.",
      },
    ],
  },
  {
    id: "eyeglasses",
    name: "Eyeglasses",
    questions: [
      {
        question: "How long does it take to get a new pair of glasses?",
        answer:
          "The timeframe varies depending on your prescription and lens options. Typically, standard prescription glasses are ready within 5-7 business days, while more complex prescriptions or specialty lenses may take 7-10 business days.",
      },
      {
        question: "How often should I replace my glasses?",
        answer:
          "We recommend having your eyes examined every 1-2 years, and updating your glasses accordingly. However, if you notice vision changes, discomfort, or if your frames are damaged, it may be time for a replacement sooner.",
      },
      {
        question: "Can I use my old frames with new lenses?",
        answer:
          "In many cases, yes. We can evaluate your existing frames to determine if they're suitable for new lenses. Factors like frame condition, your prescription requirements, and lens type will be considered.",
      },
      {
        question: "Do you offer warranties on glasses?",
        answer:
          "Yes, all our prescription eyeglasses come with a one-year warranty against manufacturing defects. We also offer extended warranty options for additional coverage.",
      },
    ],
  },
  {
    id: "contact-lenses",
    name: "Contact Lenses",
    questions: [
      {
        question: "Do I need a separate prescription for contact lenses?",
        answer:
          "Yes, a contact lens prescription is different from an eyeglasses prescription. It includes additional measurements like base curve and diameter that are specific to contact lenses.",
      },
      {
        question: "Can anyone wear contact lenses?",
        answer:
          "Most people can wear contact lenses, but they're not suitable for everyone. Factors like eye health, prescription type, and lifestyle are considered. Our optometrist will evaluate if contacts are right for you during a fitting examination.",
      },
      {
        question: "How long does it take to adjust to wearing contacts?",
        answer:
          "Adjustment periods vary by individual. Most people adapt within a few days, while others may take a week or two. Our team provides thorough instructions and support throughout this transition.",
      },
    ],
  },
  {
    id: "eye-health",
    name: "Eye Examinations & Health",
    questions: [
      {
        question: "How often should I have an eye examination?",
        answer:
          "We recommend a comprehensive eye exam every 1-2 years for most adults. However, those with existing eye conditions, certain medical conditions like diabetes, or those over 65 should have more frequent exams as advised by their eye doctor.",
      },
      {
        question: "What does a comprehensive eye exam include?",
        answer:
          "Our comprehensive exams include vision acuity testing, eye pressure measurement, examination of the eye structures, assessment for common eye diseases, and evaluation of how your eyes work together. We also discuss your eye health history and any concerns you may have.",
      },
      {
        question: "Can eye exams detect other health problems?",
        answer:
          "Yes, eye examinations can sometimes detect signs of systemic health conditions like diabetes, high blood pressure, high cholesterol, and even certain cancers. The eyes offer a unique window to view blood vessels and nerves directly.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Services",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cash, all major credit cards, debit cards, and various digital payment options. We also offer flexible payment plans for qualifying purchases.",
      },
      {
        question: "Do you offer adjustments and repairs?",
        answer:
          "Yes, we provide complimentary adjustments and minor repairs for glasses purchased from our store. For frames purchased elsewhere, a nominal service fee may apply.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day satisfaction guarantee on all prescription eyewear. If you're not completely satisfied with your purchase, we'll work with you to make it right through exchange, repair, or prescription adjustment.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our products, services, and eye
          care
        </p>
      </div>

      {/* Quick links to categories */}
      <div className="bg-gray-50 p-6 rounded-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="flex flex-wrap gap-3">
          {faqCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="bg-white px-4 py-2 rounded-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Categories and Questions */}
      <div className="space-y-12">
        {faqCategories.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{category.name}</h2>

            <div className="space-y-6">
              {category.questions.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>

            {category.id !== faqCategories[faqCategories.length - 1].id && (
              <Separator className="mt-10" />
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="bg-blue-50 p-8 rounded-lg mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Please feel free
            to reach out to our friendly customer service team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="tel:+911234567890"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-md transition-colors"
            >
              Call Us: {ContactInfo.phone}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
