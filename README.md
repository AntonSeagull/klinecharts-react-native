# klinecharts-react-native

React Native wrapper around [KLineChart](https://github.com/klinecharts/KLineChart) using WebView.  
Supports full K-line chart functionality including candlesticks, indicators, tooltips, and crosshairs.  
Compatible with both iOS and Android.

## Installation

```bash
npm install klinecharts-react-native
```

or

```bash
yarn add klinecharts-react-native
```

## Getting Started

### 1. Basic Usage

```tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  KLineChart,
  type KLineChartRef,
  type KLineData,
} from 'klinecharts-react-native';

const App = () => {
  const chartRef = useRef<KLineChartRef>(null);

  const data: KLineData[] = [
    {
      timestamp: 1717436400000,
      open: 101,
      high: 110,
      low: 98,
      close: 108,
      volume: 12345,
    },
    {
      timestamp: 1717438200000,
      open: 108,
      high: 115,
      low: 107,
      close: 111,
      volume: 23456,
    },
    // ...
  ];

  return (
    <View style={styles.container}>
      <KLineChart
        ref={chartRef}
        style={styles.chart}
        dataList={data}
        options={{}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chart: { flex: 1 },
});

export default App;
```

### 2. Props

| Prop             | Type                                                                                   | Description                                          |
| ---------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `style`          | `ViewStyle`                                                                            | Style for the chart container                        |
| `dataList`       | `KLineData[]`                                                                          | Initial candlestick data                             |
| `options`        | `Options`                                                                              | Chart options including styles, layout, locale, etc. |
| `precision`      | `Partial<Precision>`                                                                   | Decimal precision for price/volume                   |
| `onInited`       | `() => void`                                                                           | Called once the chart is initialized                 |
| `onWebViewError` | `(event: WebViewErrorEvent) => void`                                                   | Error handler for the WebView                        |
| `onTouchStart`   | `GestureResponderEvent => void`                                                        | Optional touch start event                           |
| `onTouchEnd`     | `GestureResponderEvent => void`                                                        | Optional touch end event                             |
| `indicators`     | `{ value: string \| IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions }[]` | Add indicators after chart initialization            |
| `klinechartsUrl` | `string`                                                                               | Override default URL to load `klinecharts.min.js`    |
| `base64Fonts`    | `FontBase64Type[]`                                                                     | Custom fonts as base64 if needed                     |
| `debug`          | `boolean`                                                                              | Shows debug messages over chart for development      |

### 3. Ref Methods

Use the `ref` to interact with the chart programmatically.

```ts
chartRef.current?.scrollToRealTime();
chartRef.current?.createIndicator('MA');
chartRef.current?.applyNewData(newData);
chartRef.current?.updateData(latestItem);
chartRef.current?.setStyles(newStyle);
```

All available methods are fully typed via `KLineChartRef`.

## Advanced Features

- ✅ Crosshair with price/time tooltip
- ✅ Support for custom indicators
- ✅ Dynamic style updates
- ✅ Zoom and scroll programmatically
- ✅ Multi-pane layout
- ✅ Custom fonts (via base64)
- ✅ Lightweight WebView wrapper with bridge for communication

## Fonts (optional)

If you're using custom fonts inside the chart:

```ts
base64Fonts={[
  {
    fontFamily: 'CustomFont',
    base64: 'data:font/ttf;base64,...'
  }
]}
```

## WebView Note

This chart runs inside a WebView. Ensure you enable JavaScript and DOM storage (already default in this library).

## License

[Apache-2.0](./LICENSE)

---

Made with ❤️ using [KLineChart](https://github.com/klinecharts/KLineChart) and React Native.
