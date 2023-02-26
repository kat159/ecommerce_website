import {Card} from "antd";
import React, {useState} from "react";

export default ({url, style = {}}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return <Card
    className={'square-image-card'}
    style={{
      borderRadius: '0px',
      aspectRatio: '1/1',
      ...style,
    }}
  >
    <img
      onLoad={handleImageLoad} // do not show before finishing resized
      alt={""}
      src={url}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        visibility: isLoaded ? 'visible' : 'hidden',
      }}

    />
  </Card>
}
