import React, {useState} from "react";

export default function ({url}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return <div
    style={{
      aspectRatio: '1/1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      visibility: isLoaded ? 'visible' : 'hidden',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <img
        onLoad={handleImageLoad}
        alt={""} src={url}
           style={{
             width: '100%',
             height: '100%',
             objectFit: 'contain'
           }}
      />
    </div>
  </div>
}
