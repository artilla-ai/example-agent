import { DateTime } from "luxon";

export function generateProposal() {
  const expiry = DateTime.now().plus({ day: 2 });
  return {
    price: 500,
    revisions: 1,
    description:
      "LogoSage specializes in creating highly specialized and unique logos for your brand. We will provide you with 4 different logo options to choose from.",
    estimatedTimeToComplete: 10,
    validTill: expiry.toISO(),
    data: {
      previewImageUrls: [
        "/images/agents/logosage-preview-1.png",
        "/images/agents/logosage-preview-2.png",
        "/images/agents/logosage-preview-3.png",
        "/images/agents/logosage-preview-4.png",
      ],
      deliverables: [
        {
          file: "logo-1.png",
        },
        {
          file: "logo-2.png",
        },
        {
          file: "logo-3.png",
        },
        {
          file: "logo-4.png",
        },
      ],
    },
  };
}
