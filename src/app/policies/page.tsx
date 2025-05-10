import Link from "next/link";

export default function PoliciesPage() {
  return (
    <>
      <div className="py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Our Policies</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
          We are committed to providing our customers with transparent and fair
          policies. Please review the following information about our shipping,
          returns, privacy practices, and terms of use.
        </p>

        <div className="max-w-4xl mx-auto">
          <div
            id="table-of-contents"
            className="mb-8 bg-gray-50 p-6 rounded-lg"
          >
            <h2 className="text-xl font-bold mb-4">Contents</h2>
            <ul className="space-y-2">
              <li>
                <a href="#shipping" className="text-blue-600 hover:underline">
                  1. Shipping Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-blue-600 hover:underline">
                  2. Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#refunds" className="text-blue-600 hover:underline">
                  3. Cancellations & Refunds
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-blue-600 hover:underline">
                  4. Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Shipping Policy */}
          <div
            id="shipping"
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8 scroll-mt-24"
          >
            <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Delivery Timeframes
                </h3>
                <p className="text-gray-700">
                  All orders are processed within 1-2 business days after
                  payment confirmation. Standard shipping typically takes 3-7
                  business days depending on your location. Express shipping
                  options are available at checkout for faster delivery.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Shipping Fees
                </h3>
                <p className="text-gray-700">
                  Standard shipping is free for all orders above ₹1,000. For
                  orders below this amount, a flat shipping fee of ₹100 applies.
                  Express shipping is available at an additional cost of ₹250,
                  with delivery guaranteed within 1-3 business days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Order Tracking
                </h3>
                <p className="text-gray-700">
                  Once your order is shipped, you will receive a confirmation
                  email with tracking information. You can track your
                  package&apos;s status at any time through our website or the
                  shipping carrier&apos;s portal.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  International Shipping
                </h3>
                <p className="text-gray-700">
                  We currently ship only within India. International shipping
                  options will be available soon. For customers outside India,
                  please contact our customer support for special arrangements.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Lost or Damaged Packages
                </h3>
                <p className="text-gray-700">
                  We take utmost care in packaging your products safely. In case
                  of any damage or loss during transit, please contact our
                  customer service within 48 hours of delivery. We will
                  investigate the issue and provide a suitable resolution,
                  including replacement or refund as applicable.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div
            id="terms"
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8 scroll-mt-24"
          >
            <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  General Terms
                </h3>
                <p className="text-gray-700">
                  By accessing and placing an order with Drushti Eye Care, you
                  confirm that you are agreeing to and are bound by the terms
                  and conditions contained in this document. These terms apply
                  to the entire website and any email or other communication
                  between you and Drushti Eye Care.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Product Information
                </h3>
                <p className="text-gray-700">
                  We strive to provide accurate product descriptions and images.
                  However, we do not guarantee that product descriptions or
                  other content on this site is entirely accurate, complete, or
                  current. In case of any discrepancy, we reserve the right to
                  refuse or cancel orders.
                </p>
              </div>
              <div>
                {" "}
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  User Accounts
                </h3>
                <p className="text-gray-700">
                  When you create an account with us, you must provide accurate
                  and complete information. You are responsible for maintaining
                  the confidentiality of your account details and password. You
                  agree to accept responsibility for all activities that occur
                  under your account.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Limitation of Liability
                </h3>
                <p className="text-gray-700">
                  Drushti Eye Care shall not be liable for any special,
                  incidental, indirect or consequential damages of any kind
                  arising out of or in connection with the use of our services
                  or products.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Intellectual Property
                </h3>
                <p className="text-gray-700">
                  All content included on this website, such as text, graphics,
                  logos, images, and software, is the property of Drushti Eye
                  Care and is protected by copyright, trademark, and other laws.
                  Our content may not be reproduced, duplicated, or copied
                  without our express consent.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Governing Law
                </h3>
                <p className="text-gray-700">
                  These terms and your use of the website are governed by and
                  construed in accordance with the laws of India. Any disputes
                  relating to these terms and conditions shall be subject to the
                  exclusive jurisdiction of the courts in Kudal, Maharashtra.
                </p>
              </div>{" "}
            </div>
          </div>

          <div
            id="refunds"
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8 scroll-mt-24"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Cancellations & Refunds
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Order Cancellation
                </h3>
                <p className="text-gray-700">
                  You may cancel your order within 24 hours of placing it,
                  provided the order has not been shipped. To cancel, please
                  contact our customer service through email or phone. Once an
                  order has been shipped, it cannot be canceled, but you may
                  return it according to our return policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Return Policy
                </h3>
                <p className="text-gray-700">
                  We accept returns within 7 days of delivery for
                  non-prescription eyewear in their original condition with all
                  tags and packaging intact. Custom prescription eyewear can
                  only be returned if there is a manufacturing defect or
                  incorrect prescription.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Refund Process
                </h3>
                <p className="text-gray-700">
                  Refunds for returned items will be processed within 7-10
                  business days after we receive the returned product. The
                  refund will be issued to the original payment method. Shipping
                  charges are non-refundable unless the return is due to our
                  error.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Damaged or Defective Items
                </h3>
                <p className="text-gray-700">
                  If you receive a damaged or defective product, please inform
                  us within 48 hours of delivery with photographic evidence of
                  the damage. We will arrange for a replacement or full refund,
                  including shipping costs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Prescription Adjustments
                </h3>
                <p className="text-gray-700">
                  If you experience discomfort with your prescription eyewear,
                  we offer free adjustments within 30 days of purchase. For
                  major prescription changes, additional charges may apply.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Warranty
                </h3>
                <p className="text-gray-700">
                  All frames come with a 1-year warranty against manufacturing
                  defects. The warranty covers frame repair or replacement but
                  does not cover normal wear and tear, accidental damage, or
                  scratches to lenses.
                </p>
              </div>
            </div>
          </div>
          {/* Privacy Policy */}
          <div
            id="privacy"
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm scroll-mt-24"
          >
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Information We Collect
                </h3>
                <p className="text-gray-700">
                  We collect personal information that you provide directly to
                  us, such as your name, address, email address, phone number,
                  payment information, and prescription details when you
                  register, place an order, or communicate with us.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  How We Use Your Information
                </h3>
                <p className="text-gray-700">
                  We use the information we collect to process your orders,
                  provide customer service, personalize your experience, improve
                  our website, send promotional communications, and comply with
                  legal obligations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Information Sharing
                </h3>
                <p className="text-gray-700">
                  We do not sell or rent your personal information to third
                  parties. We may share your information with service providers
                  who help us operate our business, with your consent, or to
                  comply with legal obligations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Data Security
                </h3>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized or
                  unlawful processing, accidental loss, destruction, or damage.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Cookies and Tracking
                </h3>
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your
                  browsing experience, analyze website traffic, and personalize
                  content. You can control cookies through your browser
                  settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Your Rights
                </h3>
                <p className="text-gray-700">
                  You have the right to access, correct, or delete your personal
                  information. You may also object to or restrict certain
                  processing of your data. To exercise these rights, please
                  contact us through the information provided below.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-700">
                  If you have any questions about our privacy practices or would
                  like to exercise your rights, please contact us at
                  privacy@drushtieyecare.com or call us at +91 98765 43210.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          If you have any questions about our policies, please don&apos;t
          hesitate to contact us.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Contact Us
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/faq"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View FAQs
          </Link>
        </div>
      </div>
    </>
  );
}
