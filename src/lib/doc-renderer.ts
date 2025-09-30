function renderElements(elements: any[], inlineObjects: any, positionedObjects: any): string {
  let html = '';

  elements.forEach((element: any) => {
    if (element.type === 'paragraph') {
      const paragraph = element;
      const style = paragraph.paragraphStyle;
      const headingLevel = style.namedStyleType.match(/^HEADING_(\d)$/);

      let paragraphStyle = '';
      if (style.alignment) {
        paragraphStyle += `text-align: ${style.alignment.toLowerCase()};`;
      }

      const isSingleImageParagraph = paragraph.elements.length === 1 && paragraph.elements[0].inlineObjectElement;

      if (isSingleImageParagraph) {
        paragraphStyle += `margin-bottom: 0;`;
      }

      let text = '';
      paragraph.elements.forEach((textRun: any) => {
        if (textRun.textRun) {
          let content = textRun.textRun.content;
          content = content.replace(/\n|\v/g, '<br>');
          const textStyle = textRun.textRun.textStyle;
          if (textStyle) {
            let styles = '';
            if (textStyle.bold) {
              content = `<strong>${content}</strong>`;
            }
            if (textStyle.italic) {
              content = `<em>${content}</em>`;
            }
            if (textStyle.underline) {
              content = `<u>${content}</u>`;
            }
            if (textStyle.foregroundColor) {
              const color = textStyle.foregroundColor.color.rgbColor;
              styles += `color: rgba(${color.red * 255}, ${color.green * 255}, ${color.blue * 255}, ${color.alpha || 1});`;
            }
            if (textStyle.backgroundColor) {
              const color = textStyle.backgroundColor.color.rgbColor;
              styles += `background-color: rgba(${color.red * 255}, ${color.green * 255}, ${color.blue * 255}, ${color.alpha || 1});`;
            }
            if (textStyle.fontSize) {
              styles += `font-size: ${textStyle.fontSize.magnitude}${textStyle.fontSize.unit};`;
            }
            if (textStyle.weightedFontFamily) {
              styles += `font-family: ${textStyle.weightedFontFamily.fontFamily};`;
            }
            if (styles) {
              content = `<span style="${styles}">${content}</span>`;
            }
          }
          text += content;
        } else if (textRun.inlineObjectElement) {
          const inlineObjectId = textRun.inlineObjectElement.inlineObjectId;
          if (inlineObjects && inlineObjects[inlineObjectId]) {
            const inlineObject = inlineObjects[inlineObjectId];
            const embeddedObject = inlineObject.inlineObjectProperties.embeddedObject;

            if (embeddedObject.positioning && embeddedObject.positioning.layout && embeddedObject.positioning.layout.transform) {
              // This is a positioned object, use absolute positioning logic
              const transform = embeddedObject.positioning.layout.transform;
              let objectStyle = `position: absolute; left: ${transform.translateX}pt; top: ${transform.translateY}pt; width: ${embeddedObject.size.width.magnitude}${embeddedObject.size.width.unit}; height: ${embeddedObject.size.height.magnitude}${embeddedObject.size.height.unit};`;
              if (transform.angle) {
                objectStyle += ` transform: rotate(${transform.angle}rad);`;
              }
              if (embeddedObject.imageProperties && embeddedObject.imageProperties.croppingProperties) {
                const crop = embeddedObject.imageProperties.croppingProperties;
                objectStyle += ` clip-path: inset(${crop.offsetTop * 100}% ${crop.offsetRight * 100}% ${crop.offsetBottom * 100}% ${crop.offsetLeft * 100}%);`;
              }
              text += `<img src="${embeddedObject.imageProperties.contentUri}" class="positioned-object" style="${objectStyle}" />`;
            } else if (embeddedObject.imageProperties) {
              // This is a simple inline image
              let imageStyle = '';
              if (embeddedObject.size) {
                const size = embeddedObject.size;
                if (size.width) {
                  imageStyle += `width: ${size.width.magnitude}${size.width.unit}; `;
                }
                if (size.height) {
                  imageStyle += `height: ${size.height.magnitude}${size.height.unit}; `;
                }
              }
              if (embeddedObject.imageProperties.croppingProperties) {
                const crop = embeddedObject.imageProperties.croppingProperties;
                imageStyle += `clip-path: inset(${crop.offsetTop * 100}% ${crop.offsetRight * 100}% ${crop.offsetBottom * 100}% ${crop.offsetLeft * 100}%);`;
              }
              let imageClass = 'inline-image';
              text += `<img src="${embeddedObject.imageProperties.contentUri}" class="imageClass}" style="${imageStyle}" />`;
            }
          }
        }
      });

      if (headingLevel) {
        html += `<h${headingLevel[1]} style="${paragraphStyle}">${text}</h${headingLevel[1]}>`;
      } else {
        html += `<p style="${paragraphStyle}">${text}</p>`;
      }
    } else if (element.type === 'table') {
      html += '<table>';
      element.tableRows.forEach((row: any) => {
        html += '<tr>';
        row.tableCells.forEach((cell: any) => {
          html += '<td>';
          // Recursively render cell content
          const cellElements = cell.content.map((cellContent: any) => {
            if (cellContent.paragraph) {
              return { type: 'paragraph', ...cellContent.paragraph };
            } else if (cellContent.table) {
              return { type: 'table', ...cellContent.table };
            }
            return null;
          }).filter(Boolean);

          html += renderElements(cellElements, inlineObjects, positionedObjects);
          html += '</td>';
        });
        html += '</tr>';
      });
      html += '</table>';
    }
  });

  return html;
}

export function renderGoogleDoc(doc: any) {
  const { content, inlineObjects, positionedObjects } = doc;

  let html = '<style>';
  html += `
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
    .wow-classic-style {
      font-family: 'Lora', serif;
      background-color: #1a1a1a;
      color: #f0e6d2;
      line-height: 1.8;
      background-image: url('https://www.transparenttextures.com/patterns/old-paper.png');
      padding: 2em;
      position: relative;
    }
    .wow-classic-style p {
      margin: 0 0 1.5em 0;
    }
    .wow-classic-style h1, .wow-classic-style h2, .wow-classic-style h3, .wow-classic-style h4, .wow-classic-style h5, .wow-classic-style h6 {
      font-family: 'Lora', serif;
      font-weight: 700;
      margin: 2em 0 1em 0;
      background-image: linear-gradient(to right, #2563eb, #0891b2);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .wow-classic-style ul, .wow-classic-style ol {
      margin: 0 0 1.5em 3em;
      padding: 0;
      list-style-type: none;
    }
    .wow-classic-style li {
      margin: 0 0 0.8em 0;
      position: relative;
    }
    .wow-classic-style li:before {
      content: '\f105';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      position: absolute;
      left: -1.5em;
      color: #2563eb;
    }
    .wow-classic-style table {
      border-collapse: collapse;
      width: 100%;
      border: 2px solid #4a4a4a;
    }
    .wow-classic-style td, .wow-classic-style th {
      border: 1px solid #4a4a4a;
      text-align: left;
      padding: 12px;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .wow-classic-style th {
      background-color: #2a2a2a;
      color: #2563eb;
    }
    .wow-classic-style strong {
      color: #2563eb;
    }
    .wow-classic-style em {
      font-style: italic;
      color: #c7c7c7;
    }
    .wow-classic-style u {
      text-decoration: underline;
      text-decoration-color: #2563eb;
    }
    .wow-classic-style a {
      color: #2563eb;
      text-decoration: none;
    }
    .wow-classic-style a:hover {
      text-decoration: underline;
    }
    .wow-classic-style .inline-image {
      max-width: 100%;
      height: auto;
      border: 0;
      background: none;
    }
    .positioned-object {
      position: absolute;
    }
    .left-float {
      float: left;
      margin-right: 1em;
    }
    .right-float {
      float: right;
      margin-left: 1em;
    }
  `;
  html += '</style>';
  html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">';
  html += '<div class="wow-classic-style">';

  // First pass: render positioned objects
  if (positionedObjects) {
    for (const objectId in positionedObjects) {
      const positionedObject = positionedObjects[objectId];
      const embeddedObject = positionedObject.positionedObjectProperties.embeddedObject;
      const transform = positionedObject.positionedObjectProperties.positioning.layout.transform;
      let objectStyle = `position: absolute; left: ${transform.translateX}pt; top: ${transform.translateY}pt; width: ${embeddedObject.size.width.magnitude}${embeddedObject.size.width.unit}; height: ${embeddedObject.size.height.magnitude}${embeddedObject.size.height.unit};`;
      if (transform.angle) {
        objectStyle += ` transform: rotate(${transform.angle}rad);`;
      }

      if (embeddedObject.imageProperties) {
        if (embeddedObject.imageProperties.croppingProperties) {
          const crop = embeddedObject.imageProperties.croppingProperties;
          objectStyle += ` clip-path: inset(${crop.offsetTop * 100}% ${crop.offsetRight * 100}% ${crop.offsetBottom * 100}% ${crop.offsetLeft * 100}%);`;
        }
        let shape = 'rect(0, 100%, 100%, 0)';
        if (embeddedObject.shape) {
          if (embeddedObject.shape.type === 'ROUND_RECTANGLE') {
            shape = `url(#rounded-rect-${objectId})`;
            html += `<svg width="0" height="0"><defs><clipPath id="rounded-rect-${objectId}"><rect x="0" y="0" width="100%" height="100%" rx="${embeddedObject.shape.properties.cornerRadius}pt" ry="${embeddedObject.shape.properties.cornerRadius}pt" /></clipPath></defs></svg>`;
          } else if (embeddedObject.shape.type === 'ELLIPSE') {
            shape = 'circle(50% at 50% 50%)';
          } else if (embeddedObject.shape.type === 'POLYGON') {
            const points = embeddedObject.shape.properties.points.map((point: any) => `${point.x}px ${point.y}px`).join(',');
            shape = `polygon(${points})`;
          }
        }
        objectStyle += ` shape-outside: ${shape};`;
        html += `<img src="${embeddedObject.imageProperties.contentUri}" class="positioned-object" style="${objectStyle}" />`;
      } else if (embeddedObject.embeddedDrawing) {
        // Handle embedded drawings (e.g., text boxes)
        let textContent = '';
        embeddedObject.embeddedDrawing.data.forEach((item: any) => {
          if (item.shape && item.shape.text) {
            item.shape.text.textElements.forEach((textElement: any) => {
              if (textElement.textRun) {
                textContent += textElement.textRun.content;
              }
            });
          }
        });
        html += `<div class="positioned-object" style="${objectStyle}">${textContent}</div>`;
      }
    }
  }

  // Second pass: render content using the new function
  html += renderElements(content, inlineObjects, positionedObjects);

  html += '</div>';

  return html;
}