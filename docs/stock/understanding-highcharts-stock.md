Understanding Highcharts Stock
===

Highcharts Stock is based on Highcharts, meaning it has all the core functionality of Highcharts, plus some additional features.

![understanding_highstock.png](understanding_highstock.png)

Highcharts Stock also supports various financial series types.

<iframe style="width: 100%; height: 550px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/series-type allow="fullscreen"></iframe>

```js
chart.series[0].update({
    type: 'candlestick'
});
```

See [Update series method](https://api.highcharts.com/class-reference/Highcharts.Series#update).

Navigator and scrollbar
---------

Allows you to fine tune the range of the chart which is displayed and scroll through it.

See [Navigator](https://highcharts.com/docs/stock/navigator) for more information.

<iframe style="width: 100%; height: 640px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/navigator allow="fullscreen"></iframe>

```js
chart.update({
    navigator: {
        enabled: true,
        height: 100
    },
    scrollbar: {
        enabled: false
    }
});
```
Navigator and scrollbar does not have its own update method, use [Chart update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) instead.


Range selector
--------------

Allows you to quickly select a range to be shown on the chart or specify the exact interval to be shown.

<iframe style="width: 100%; height: 600px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/range-selector allow="fullscreen"></iframe>

See [Range selector](https://highcharts.com/docs/stock/range-selector) for more information.

```js
chart.update({
    rangeSelector: {
        enabled: true,
    }
});
```

Range selector does not have its own update method, use [Chart update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) instead.

Crosshair
---------

Shows a line following the tooltip of a chart to better read results of the axes. This functionality can be found in the [Axis](https://api.highcharts.com/highstock/xAxis.crosshair) options. Crosshairs can also be used in Highcharts, but are not enabled by default.

<iframe style="width: 100%; height: 600px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/crosshair allow="fullscreen"></iframe>

```js
chart.xAxis[0].update({
    crosshair: {
        snap: false
    }
});
```

Crosshair is an axis property, therefore update it via [Axis update](https://api.highcharts.com/class-reference/Highcharts.Axis#update).