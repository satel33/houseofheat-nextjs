import random from 'lodash/random'
import { groq } from 'next-sanity'

export const ASSET_PROJECTION = groq`
  _id,
  altText,
  title,
  description,
  assetId,
  extension,
  originalFilename,
  metadata {
    dimensions,
    isOpaque,
    hasAlpha,
    "palette": {
      "dominant": {
        "background": palette.dominant.background
      }
    }
  },
  mimeType,
  url,
  hotspot,
  crop
`

export const IMAGE_PROJECTION = groq`
  ...,
  "asset": asset-> {
    ${ASSET_PROJECTION}
  }
`
export const CATEGORY_AND_BRAND_PROJECTION = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
  "smallLogo": smallLogo { ${IMAGE_PROJECTION} },
  "largeLogo": largeLogo { ${IMAGE_PROJECTION} },
  visibleInFilters
`

export const BRAND_PROJECTION = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
  visibleInFilters
`

export const MODEL_PROJECTION = groq`
  _id,
  _type,
  title,
  "slug": slug.current
`

export const RELEASE_BUY_LINKS_PROJECTION = groq`
  _key,
  text,
  url,
  linkType,
  avilableFrom,
  avilableTo,
  "store": store->{ _id, title }
`

export const PAGE_REFERENCE_PROJECTION = groq`
  _id,
  _type,
  title,
  pageType,
  publishedDate,
  excerpt,
  "author": author-> {
    name
  },
  "slug": slug.current,
  "releases": releases[]-> {
    title,
    releaseDate,
    releaseDateLabel,
    "brand": brand->{ ${BRAND_PROJECTION} },
    "shoppingButtons": shoppingButtons[] { ${RELEASE_BUY_LINKS_PROJECTION}}
  },
  "categories": categories[]-> { ${CATEGORY_AND_BRAND_PROJECTION} },
  "brand": brand->{ ${BRAND_PROJECTION} },
  "model": model->{ ${MODEL_PROJECTION} },
  "tags": tags[]-> { _id, title, "slug": slug.current },
  "pageTheme": pageTheme,
  "featuredImages": featuredImages[] { ${IMAGE_PROJECTION} },
  rating
`

export const RELEASE_REFERENCE_PROJECTION = groq`
  _id,
  _type,
  title,
  color,
  styleCode,
  releaseDate,
  releaseDateLabel,
  "featuredImage": featuredImage { ${IMAGE_PROJECTION} },
  "brand": brand-> { ${BRAND_PROJECTION} },
  "model": model->{ ${MODEL_PROJECTION} },
  pageTheme,
  "relatedArticle": relatedArticle-> { 
    _id,
    _type,
    title,
    pageType,
    pageTheme,
    "featuredImages": featuredImages[] { ${IMAGE_PROJECTION} },
    publishedDate,
    "slug": slug.current,
    "brand": brand-> { ${BRAND_PROJECTION} },
    rating
   },
   "shoppingButtons": shoppingButtons[] { ${RELEASE_BUY_LINKS_PROJECTION}}
`

/**
  References and Images will be resolved automatically.
  You can add your own custom transforms here for example:

  _type == 'slice_type' => {
    ...,
    "related": *[_type == "page"][0...5],
    "doc": doc->{ image }
  },
 */
export const SLICES_PROJECTION = groq`
  true => { ${'' /* This is needed to get the other slice types. */}
    ...
  },
  _type == 'releaseGridSlice' => { ${'' /* We need to get the richtext slice in so we can parse the description out when the except is missing. */}
    ...,
    "releases": releases[] {
      ...,
      "release": release->{ ${PAGE_REFERENCE_PROJECTION}, "slices": slices[_type == 'richTextSlice'][0...1] }
    }
  },
`

/**
 * PAGES PROJECTIONS
 */

export const TAG_PAGE_PROJECTION = groq`
  ...,
  "pageType": "tag",
  "slug": slug.current,
  "slices": [
    {
      "_key": '${random(100000)}',
      "_type": "pageHero",
      "title": title,
      "description": description,
    },
    {
      "_key": '${random(100000)}',
      "_type": "releasesSlice",
      "title": "Releases",
      "filters": { "brands": [ _id ] },
      "showBrandFilter": false
    },
    {
      "_key": '${random(100000)}',
      "_type": "articlesSlice",
      "filters": select(
        { "brands": [ _id ] }
      ),
      "showBrandFilter": false,
    }   
  ]
`

export const NORMAL_PAGE_PROJECTION = groq`
  "pageTheme": pageTheme,
  "featuredImages": featuredImages[] { ${IMAGE_PROJECTION} },
  "categories": categories[]-> { ${CATEGORY_AND_BRAND_PROJECTION} },
  "tags": tags[]-> { _id, title, "slug": slug.current },
  "author": author-> { ... },
  "slices": slices[] { ${SLICES_PROJECTION} },
  "brand": brand->{${BRAND_PROJECTION}},
  "model": model->{ ${MODEL_PROJECTION} },
  publishedDate,
  "releases": releases[]-> {
    ...,
    "brand": brand->{${BRAND_PROJECTION}},
    "model": model->{${MODEL_PROJECTION}},
    "shoppingButtons": shoppingButtons[] { ${RELEASE_BUY_LINKS_PROJECTION}}
  },
  rating,
  pageType == 'culture' || pageType == 'release' => {
    "next": *[!(_id in path('drafts.**')) && _id != ^._id && _type == 'page' && publishedDate < ^.publishedDate && (pageType == 'culture' || pageType == 'release')] | order(publishedDate desc) [0] {
      "slug": slug.current,
      pageType,
      "pageTheme": pageTheme,
      "dominantColor": featuredImages[0].asset->metadata.palette.dominant.background,
      "brand": brand->{${BRAND_PROJECTION}}
    }
  }
`

// Document-level query
export const PAGE_PROJECTION = groq`
  ...,
  // Common fields
  "slug": slug.current,
  // Release page fields = use the release reference projection
  _type == 'release' => {
    ${RELEASE_REFERENCE_PROJECTION}
  },
  // "Normal" page related fields
  _type == 'page' || _type == 'errorPage' => {
    ${NORMAL_PAGE_PROJECTION}
  },
`

// "Global" level query
export const SETTINGS_PROJECTION = groq`
  ...,
  "menu": menu {
    "links": links[]-> {
      _id,
      title,
      "slug": slug.current
    },
    "brands": brands[]-> {${CATEGORY_AND_BRAND_PROJECTION}},
    "about": menuAboutLinks,
    "socials": menuSocialLinks[] {
      _key,
      type,
      url
    },
    copyrightLeft,
    copyrightRight,
  },
  "defaultStoreLinks": defaultStoreLinks[]{
    url,
    "store": store->{
      title,
      _id,
      "slug": slug.current
    }
  }
`
