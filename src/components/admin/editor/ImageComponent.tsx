import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';

const ImageComponent = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const { src, alt, width, height, align } = node.attrs;

  const handleAlign = (alignment: string) => {
    updateAttributes({ align: alignment });
  };

  return (
    <NodeViewWrapper className={`image-component-wrapper align-${align}`}>
      <img src={src} alt={alt} width={width} height={height} />
      {selected && (
        <div className="image-controls">
          <button onClick={() => handleAlign('left')}>Left</button>
          <button onClick={() => handleAlign('center')}>Center</button>
          <button onClick={() => handleAlign('right')}>Right</button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ImageComponent;
