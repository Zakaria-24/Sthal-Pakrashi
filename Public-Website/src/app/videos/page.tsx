import { getVideos } from "@/lib/api";
import { VideoGallery } from "@/components/pages/video-gallery";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";
import { toEmbedUrl, youtubeThumbnail } from "@/lib/video";

export const generateMetadata = titleMetadata("page.videos.title");

export default async function VideosPage() {
  const [{ t }, { data: videos }] = await Promise.all([
    getPageContext(),
    getVideos(),
  ]);

  const cards = videos.map((video) => {
    const embedUrl = toEmbedUrl(video.videoUrl);
    return {
      id: video._id,
      title: video.title,
      description: video.description,
      category: video.category,
      thumbnail: video.thumbnailUrl || youtubeThumbnail(video.videoUrl) || "",
      embedUrl,
      externalUrl: !embedUrl && video.videoUrl ? video.videoUrl : null,
    };
  });

  return (
    <>
      <PageHeader
        title={t("page.videos.title")}
        description={t("page.videos.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.videos.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {videos.some((video) => video.isDemo) && (
          <p className="mb-5">
            <SampleBadge label={t("common.demoContent")} />
          </p>
        )}
        <VideoGallery videos={cards} />
      </Section>
    </>
  );
}
