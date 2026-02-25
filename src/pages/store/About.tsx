import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-primary-500">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-light text-dark mb-2 tracking-tight">
            About Tabitha Books
          </h1>
          <div className="w-12 h-1 bg-primary-500 mb-8"></div>

          <div className="space-y-8 text-xs font-light text-gray-600 leading-relaxed tracking-wide">
            <p>
              Tabitha Books is a curated online bookstore dedicated to sharing
              transformative stories. We believe in the power of reading to
              inspire growth, spark imagination, and create meaningful
              connections. Every book in our collection has been handpicked for
              its quality, authenticity, and potential to impact lives.
            </p>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-sm font-light text-dark mb-4 uppercase tracking-widest">
                Our Mission
              </h2>
              <p>
                To democratize access to transformative literature that inspires
                personal growth, sparks restless ambition, and cultivates
                authentic living. We believe every individual deserves stories
                and resources that challenge their thinking, expand their
                worldview, and fuel their journey toward their highest self.
                Tabitha Books exists to be your companion in this
                quest—carefully curating works that matter, from fiction that
                moves the soul to wisdom that reshapes perspective.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-sm font-light text-dark mb-4 uppercase tracking-widest">
                Our Core Values: AFRICA
              </h2>
              <ul className="space-y-2 ml-4">
                <li>
                  <span className="text-primary-500">A</span> - Ambition: Drive
                  and determination to achieve greatness
                </li>
                <li>
                  <span className="text-primary-500">F</span> - Faith: Trust in
                  purpose and divine direction
                </li>
                <li>
                  <span className="text-primary-500">R</span> - Refinement:
                  Excellence in quality and execution
                </li>
                <li>
                  <span className="text-primary-500">I</span> - Identity:
                  Authentic expression of who you truly are
                </li>
                <li>
                  <span className="text-primary-500">C</span> - Confidence:
                  Believing in your power and inherent worth
                </li>
                <li>
                  <span className="text-primary-500">A</span> - Audacity:
                  Courage to stand out and be authentically bold
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-sm font-light text-dark mb-4 uppercase tracking-widest">
                The Muse Community
              </h2>
              <p>
                Our customers are called "Muse" – a gender-inclusive community of visionaries, dreamers, and doers connected by purpose and belonging. A Muse is someone who refuses to be ordinary, who reads to grow, who questions to evolve, and who believes their life is their greatest work. We're not just building a customer base; we're cultivating a movement of individuals who dare to live authentically, think critically, and lead with intention. When you join Tabitha Books, you join a community of Muses committed to transformation—your own, and by extension, the world's.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-sm font-light text-dark mb-4 uppercase tracking-widest">
                Our Products
              </h2>
              <p className="mb-6">
                Our collection is designed to support your transformation journey. Every item has been carefully selected to serve a purpose.
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-primary-500 font-light mb-1">Curated Books</p>
                  <p className="text-xs text-gray-500">Leadership, fiction, and lifestyle reads that inspire growth and challenge perspective. Each title in our collection has been vetted for authenticity, quality, and transformative potential.</p>
                </div>
                
                <div>
                  <p className="text-primary-500 font-light mb-1">Premium Journals</p>
                  <p className="text-xs text-gray-500">Intentional spaces for reflection, dreams, and clarity. Our journals are designed for those ready to translate inspiration into action—to document their journey and manifest their ambition.</p>
                </div>
                
                <div>
                  <p className="text-primary-500 font-light mb-1">Signature Apparel</p>
                  <p className="text-xs text-gray-500">I Dare to Stand Out, Ambitious and Anointed, Fierce and Fearless – wearable affirmations that declare your values to the world. Every piece is a conversation starter, a reminder of who you're becoming.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/shop"
              className="inline-block px-6 py-3 text-white font-light text-xs transition uppercase tracking-widest"
              style={{
                backgroundColor: "#FF5B00",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
