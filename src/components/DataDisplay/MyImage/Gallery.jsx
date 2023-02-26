import React from 'react';
// import MyImage from "@/components/DataDisplay/MyImage";
import ImageGallery from "react-image-gallery";
import MyImage from "@/components/DataDisplay/MyImage";

const urls = [
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264880_undefined?alt=media&token=520fe7d3-f4c8-4000-9819-cdbface7c60b",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264881_undefined?alt=media&token=6b41132e-e03d-4cff-8ed2-c8314e9f4482",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264883_undefined?alt=media&token=b470aa49-e7d1-4288-9393-90765fbf418f",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264880_undefined?alt=media&token=520fe7d3-f4c8-4000-9819-cdbface7c60b",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264881_undefined?alt=media&token=6b41132e-e03d-4cff-8ed2-c8314e9f4482",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-6ee5d.appspot.com/o/sku-image%2F1677243264883_undefined?alt=media&token=b470aa49-e7d1-4288-9393-90765fbf418f",
]
function Gallery({urls}) {

  const imageData = urls.map(url => ({
    original: url,
    thumbnail: url,
  }))
  return (
    <div>
      <ImageGallery className="image-gallery"
        items={imageData}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        showBullets={false}
        showThumbnails={true}
        showIndex={false}
        renderItem={(item) => (
          <div
            style={{
              padding: '0 min(10%, 10px)',
            }}
          >
            <MyImage.FitSize url={item.original}/>
          </div>
        )}
        thumbnailWidth={50}
        renderThumbInner={(item) => (
          <div
            style={{
              padding: 'min(10%, 10px)',
              border: '1px solid #e8e8e8',
            }}
          >
            <MyImage.FitSize url={item.original} style={{}}/>
          </div>
        )}
      />
    </div>
  );
}

export default Gallery;
