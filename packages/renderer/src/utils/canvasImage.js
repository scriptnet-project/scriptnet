import html2canvas from 'html2canvas';

export const getLegendImage = () => {
  const legend = document.getElementById('legend');

  return html2canvas(legend, { scale: 4 })
    .then((canvas) => {
      const width = canvas.getAttribute('width');
      const height = canvas.getAttribute('height');
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, width, height);
      return data;
    });
};

export const getSVGImage = () => {
  const svg = document.getElementsByTagName('svg')[0];

  return html2canvas(svg, { scale: 4 })
    .then((canvas) => {
      const width = canvas.getAttribute('width');
      const height = canvas.getAttribute('height');
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, width, height);
      return data;
    });
};
