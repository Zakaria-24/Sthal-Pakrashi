import { getGallery } from "@/lib/api";
import { GalleryBrowser } from "@/components/pages/gallery-browser";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.gallery.title");

export default async function GalleryPage() {
  const [{ t }, { data: gallery }] = await Promise.all([
    getPageContext(),
    getGallery(),
  ]);

  return (
    <>
      <PageHeader
        title={t("page.gallery.title")}
        description={t("page.gallery.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.gallery.crumb") },
        ]}
      />
      <Section size="md" reveal>
        <GalleryBrowser
          photos={gallery.map((item) => ({
            id: item._id,
            imageUrl: item.imageUrl,
            title: item.caption?.trim() || item.title,
            category: item.category,
            isDemo: item.isDemo,
          }))}
        />
      </Section>
    </>
  );
}
