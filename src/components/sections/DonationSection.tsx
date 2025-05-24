
import DonationHero from "@/components/donation/DonationHero";
import WhyDonate from "@/components/donation/WhyDonate";
import DonationForm from "@/components/donation/DonationForm";
import AlternativeSupport from "@/components/donation/AlternativeSupport";

const DonationSection = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DonationHero />

      {/* Donation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left side - Why donate */}
              <WhyDonate />

              {/* Right side - Donation form */}
              <div>
                <DonationForm />
                <AlternativeSupport />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonationSection;
