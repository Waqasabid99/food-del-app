import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import useAuthStore from "../store/authStore";

const Contact = ({ handleShowLogin }) => {
  const { showLogin, showSignup } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Add form submission logic here
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    });
  };

  const contactInfo = [
    {
      icon: "📞",
      title: "Phone",
      info: "+1 (555) 123-FOOD",
      description: "Mon-Sun: 8:00 AM - 11:00 PM",
    },
    {
      icon: "✉️",
      title: "Email",
      info: "support@fooddelivery.com",
      description: "We reply within 2 hours",
    },
    {
      icon: "📍",
      title: "Address",
      info: "123 Food Street, Los Angeles, CA 90210",
      description: "Visit our main kitchen",
    },
    {
      icon: "🕒",
      title: "Hours",
      info: "8:00 AM - 11:00 PM",
      description: "7 days a week",
    },
  ];

  const faqItems = [
    {
      question: "What areas do you deliver to?",
      answer: "We deliver across California with free delivery within 15KM of our locations. Delivery fees may apply for longer distances.",
    },
    {
      question: "How long does delivery take?",
      answer: "Our standard delivery time is 25-30 minutes. During peak hours, it may take up to 45 minutes.",
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order is confirmed, you'll receive a tracking link to monitor your delivery in real-time.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and cash on delivery for your convenience.",
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "order", label: "Order Issue" },
    { value: "delivery", label: "Delivery Problem" },
    { value: "feedback", label: "Feedback" },
    { value: "partnership", label: "Partnership" },
    { value: "complaint", label: "Complaint" },
  ];

  return (
    <>
      {!showLogin && !showSignup && (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar handleShowLogin={handleShowLogin} />
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 py-16 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                Have questions, feedback, or need help with your order? We're here to help! 
                Reach out to us anytime and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
                    <div className="text-4xl mb-4">{info.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{info.title}</h3>
                    <p className="text-orange-500 dark:text-orange-400 font-medium mb-2 transition-colors duration-300">{info.info}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{info.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Contact Section */}
          <div className="py-16 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                          Inquiry Type
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        >
                          {inquiryTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-orange-400 dark:focus:border-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors duration-300"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 dark:bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Information & Map */}
                <div className="space-y-8">
                  {/* Quick Contact */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">Quick Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="text-orange-500 dark:text-orange-400 text-xl">📞</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Customer Support</p>
                          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">+1 (555) 123-FOOD</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Available 8 AM - 11 PM daily</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="text-orange-500 dark:text-orange-400 text-xl">💬</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Live Chat</p>
                          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Available on our website</p>
                          <button className="text-orange-500 dark:text-orange-400 text-sm hover:text-orange-600 dark:hover:text-orange-300 transition-colors duration-300">
                            Start Chat →
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="text-orange-500 dark:text-orange-400 text-xl">⚡</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">Emergency Orders</p>
                          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">For urgent delivery needs</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Call: +1 (555) 123-RUSH</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">Find Us</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center mb-4 transition-colors duration-300">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p className="transition-colors duration-300">Interactive Map</p>
                        <p className="text-sm transition-colors duration-300">123 Food Street, Los Angeles, CA</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        <span className="font-medium">Address:</span> 123 Food Street, Los Angeles, CA 90210
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        <span className="font-medium">Parking:</span> Free parking available
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        <span className="font-medium">Public Transport:</span> Metro Red Line - Hollywood/Highland
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Frequently Asked Questions</h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Find quick answers to common questions about our service
                </p>
              </div>
              <div className="space-y-6">
                {faqItems.map((faq, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">Still have questions?</p>
                <button className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300">
                  View All FAQs
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 transition-colors duration-300">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
              <p className="text-xl leading-relaxed mb-8">
                Don't wait! Browse our delicious menu and get your favorite food 
                delivered in just 25-30 minutes across California.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white dark:bg-gray-200 text-orange-500 dark:text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-300">
                  Order Now
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 dark:hover:bg-gray-200 dark:hover:text-orange-600 transition-colors duration-300">
                  Browse Menu
                </button>
              </div>
            </div>
          </div>

          <Newsletter />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Contact;