import { getSiteData } from "@/lib/data";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { PortfolioSection } from "@/components/site/portfolio-section";
import { Testimonials } from "@/components/site/testimonials";
import { WhatsAppSection } from "@/components/site/whatsapp-section";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { Footer } from "@/components/site/footer";

// Revalidate frequently for a fast, cache-friendly public page; dashboard
// edits also trigger an immediate on-demand revalidation of this route.
export const revalidate = 60;

export default async function HomePage() {
  const { images, testimonials, settings } = await getSiteData();

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <PortfolioSection images={images} />
        <Testimonials testimonials={testimonials} />
        <WhatsAppSection settings={settings} />
      </main>
      <Footer />
      <FloatingWhatsApp phone={settings.whatsapp_phone} message={settings.whatsapp_message} />
    </>
  );
}
