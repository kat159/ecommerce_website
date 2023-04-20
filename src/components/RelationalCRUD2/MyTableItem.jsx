const Image = ({
    src,
    alt,
}) => {

    return <img
        src={src}
        alt={alt}
        style={{
            maxHeight: 'min(10vh,40px)',
        }}
    />
}

export default {
    Image,
}
