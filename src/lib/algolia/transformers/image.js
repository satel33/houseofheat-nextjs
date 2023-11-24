export default function transformImage (image) {
  if (!image) return null

  return {
    alt: image.alt,
    caption: image.caption,
    asset: image.asset
      ? {
          _id: image.asset._id,
          crop: image.asset.crop,
          hotspot: image.asset.hotspot,
          url: image.asset.url,
          metadata: image.asset.metadata
            ? {
                blurHash: image.asset.metadata.blurHash,
                dimensions: image.asset.metadata.dimensions
              }
            : null
        }
      : null
  }
}
