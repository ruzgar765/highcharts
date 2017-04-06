QUnit.test('#6433 - axis.update leaves empty plotbands\' groups', function (assert) {
    var chart = new Highcharts.chart('container', {
        xAxis: {
            plotBands: [{
                from: 0.5,
                to: 1,
                color: 'red'
            }]
        },
        series: [{
            data: [10, 20]
        }]
    });

    chart.xAxis[0].update({});
    chart.xAxis[0].update({});

    assert.strictEqual(
        document.getElementsByClassName('highcharts-plot-bands-0').length,
        1,
        'Just one plotband group'
    );
});

QUnit.test('#6521 - missing labels for narrow bands', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        xAxis: {
            min: Date.UTC(2016, 0, 13),
            max: Date.UTC(2016, 0, 27),
            type: 'datetime',
            plotBands: [{
                color: "#BDBDBD",
                from: Date.UTC(2016, 0, 18, 4),
                to: Date.UTC(2016, 0, 18, 4, 20),
                label: {
                    rotation: 90,
                    text: 'Wide Enough'
                }
            }, {
                color: "red",
                from: Date.UTC(2016, 0, 25, 8),
                to: Date.UTC(2016, 0, 25, 8),
                label: {
                    rotation: 90,
                    text: 'Too Narrow'
                }
            }]
        },
        series: [{}]
    });

    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[0].label.element.textContent,
        'Wide Enough',
        'First label set'
    );
    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.element.textContent,
        'Too Narrow',
        'Second label set'
    );

    chart.xAxis[0].setExtremes(null, Date.UTC(2016, 0, 20));
    assert.strictEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.attr('visibility'),
        'hidden',
        'Outside range, label hidden'
    );

    chart.xAxis[0].setExtremes(null, Date.UTC(2016, 0, 30));
    assert.notEqual(
        chart.xAxis[0].plotLinesAndBands[1].label.attr('visibility'),
        'hidden',
        'Inside range, label shown'
    );
});
