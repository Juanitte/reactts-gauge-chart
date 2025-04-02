# Gauge charts library
Powered by Chart.js.

## Usage example (Every prop used with their default values. Props are optional):

```html
<GaugeChart
    needleCurrentValue={0}
    minValue={0}
    maxValue={100}
    veryLowLimit={10}
    lowLimit={30}
    highLimit={70}
    veryHighLimit={90}
    veryLowColor="rgba(27, 98, 190, 0.77)"
    lowColor="rgba(255, 227, 68, 0.77)"
    goodColor="rgba(71, 185, 48, 0.77)"
    highColor="rgba(255, 132, 31, 0.77)"
    veryHighColor="rgba(190, 27, 27, 0.77)"
    borderVeryLowColor="rgba(27, 98, 190, 0.77)"
    borderLowColor="rgba(255, 227, 68, 0.77)"
    borderGoodColor="rgba(71, 185, 48, 0.77)"
    borderHighColor="rgba(255, 132, 31, 0.77)"
    borderVeryHighColor="rgba(190, 27, 27, 0.77)"
    needleBorderColor="rgb(136, 136, 136)"
    needleFillColor="rgb(136, 136, 136)"
    needleWidth={5}
    meterFont="bold 30px sans-serif"
    meterColor="rgb(34, 34, 34)"
    labelFont="14px sans-serif"
    labelColor="rgb(34, 34, 34)"
    aspectRatio={1.5}
    paddingTop={20}
    paddingBottom={80}
    paddingLeft={40}
    paddingRight={40}
    arcBorderWidth={0}
    arcBorderColor="transparent"
    datasetBorderWidth={0}
    cutout="65%"
    canvasWidth={400}
/>