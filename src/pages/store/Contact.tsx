import React, { useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-primary-500">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-light text-dark mb-2 tracking-tight">
              Get in Touch
            </h1>
            <div className="w-12 h-1 bg-primary-500 mb-8"></div>
            <p className="text-xs font-light text-gray-600 tracking-wide">
              We'd love to hear from you. Drop us a message anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            <div className="border border-gray-200 p-6 text-center hover:border-primary-500 transition">
              <Phone className="w-5 h-5 text-primary-500 mx-auto mb-3" />
              <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                Phone
              </h3>
              <a
                href="tel:+2348180129670"
                className="text-xs font-light text-gray-600 hover:text-primary-500 transition"
              >
                +234 818 012 9670
              </a>
            </div>

            <div className="border border-gray-200 p-6 text-center hover:border-primary-500 transition">
              <Mail className="w-5 h-5 text-primary-500 mx-auto mb-3" />
              <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                Email
              </h3>
              <a
                href="mailto:hello@tabithabooks.com"
                className="text-xs font-light text-gray-600 hover:text-primary-500 transition"
              >
                hello@tabithabooks.com
              </a>
            </div>

            <div className="border border-gray-200 p-6 text-center hover:border-primary-500 transition">
              <MapPin className="w-5 h-5 text-primary-500 mx-auto mb-3" />
              <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                Location
              </h3>
              <p className="text-xs font-light text-gray-600">Lagos, Nigeria</p>
            </div>

            <div className="border border-gray-200 p-6 text-center hover:border-primary-500 transition">
              <Send className="w-5 h-5 text-primary-500 mx-auto mb-3" />
              <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                WhatsApp
              </h3>
              <a
                href="https://wa.me/2348180129670"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light text-gray-600 hover:text-primary-500 transition"
              >
                Chat Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-sm font-light text-dark mb-8 uppercase tracking-widest">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition uppercase tracking-widest rounded-lg"
                >
                  Send Message
                </button>

                {submitted && (
                  <div className="p-3 bg-primary-50 text-primary-700 text-center text-xs font-light border border-primary-200">
                    ✓ Message sent! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-sm font-light text-dark mb-8 uppercase tracking-widest">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 p-4">
                  <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                    What's your return policy?
                  </h3>
                  <p className="text-gray-600 text-xs font-light">
                    We offer a 30-day return policy for all items in original
                    condition.
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                    How long does shipping take?
                  </h3>
                  <p className="text-gray-600 text-xs font-light">
                    Delivery typically takes 3-5 business days within Lagos, and
                    5-7 business days nationwide.
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                    Do you ship internationally?
                  </h3>
                  <p className="text-gray-600 text-xs font-light">
                    Currently, we ship within Nigeria. International shipping
                    coming soon!
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <h3 className="font-light text-xs text-dark mb-2 uppercase tracking-widest">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 text-xs font-light">
                    We accept bank transfers, card payments, and mobile money
                    transfers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
