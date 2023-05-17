QUnit.module('Format', () => {
    const format = Highcharts.format;

    // Arrange
    const point = {
        key: 'January',
        value: Math.PI,
        long: 12345.6789,
        date: Date.UTC(2012, 0, 1),
        deep: {
            deeper: 123
        },
        dom: {
            string: 'Hello',
            container: document.getElementById('container'),
            doc: document,
            win: window
        },
        fn: function () {
            return 'Hello';
        },
        proto: new Date(),
        items: ['Ein', 'To', 'Tre'],
        persons: [{
            firstName: 'Mick',
            lastName: 'Jagger'
        }, {
            firstName: 'Keith',
            lastName: 'Richards'
        }]
    };

    const nullPoint = {
        isNull: true
    };

    QUnit.test('Replacement', function (assert) {

        assert.strictEqual(
            Math.PI.toString(),
            format('{point.value}', { point: point }),
            'Basic replacement'
        );

        assert.strictEqual(
            '3.14',
            format('{point.value:.2f}', { point: point }),
            'Replacement with two decimals'
        );

        // localized thousands separator and decimal point
        Highcharts.setOptions({
            lang: {
                decimalPoint: ',',
                thousandsSep: ' '
            }
        });
        assert.strictEqual(
            '12 345,68',
            format('{point.long:,.2f}', { point: point }),
            'Localized format'
        );

        // default thousands separator and decimal point
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        assert.strictEqual(
            '12,345.68',
            format('{point.long:,.2f}', { point: point }),
            'Thousands separator format'
        );

        // Date format with colon
        assert.strictEqual(
            '00:00:00',
            format('{point.date:%H:%M:%S}', { point: point }),
            'Date format with colon'
        );

        // Deep access
        assert.strictEqual(
            '123',
            format('{point.deep.deeper}', { point: point }),
            'Deep access format'
        );

        // Shallow access
        assert.strictEqual(
            '123',
            format('{value}', { value: 123 }),
            'Shallow access format'
        );

        // Formatted shallow access
        assert.strictEqual(
            '123.00',
            format('{value:.2f}', { value: 123 }),
            'Shallow access format with decimals'
        );

        // Six decimals by default
        assert.strictEqual(
            '12345.567',
            format('{value:f}', { value: 12345.567 }),
            'Keep decimals by default'
        );

        // Complicated string format
        assert.strictEqual(
            'Key: January, value: 3.14, date: 2012-01-01.',
            format(
                'Key: {point.key}, value: {point.value:.2f}, date: ' +
                '{point.date:%Y-%m-%d}.',
                { point: point }
            ),
            'Complex string format'
        );

        assert.strictEqual(
            '',
            Highcharts.format('{point.y}', {}),
            'Do not choke on undefined objects (node-export-server#31)'
        );

        assert.strictEqual(
            format('{point.dom.string}', { point }),
            'Hello',
            'Primitive type verified'
        );

        assert.strictEqual(
            format('{point.dom.container}', { point }),
            '',
            'DOM nodes should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.container.ownerDocument.referrer}', { point }),
            '',
            'DOM properties should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.doc}', { point }),
            '',
            'The document should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.dom.win}', { point }),
            '',
            'The window/global should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.fn}', { point }),
            '',
            'Functions should not be accessible through format strings'
        );

        assert.strictEqual(
            format('{point.proto.__proto__}', { point }),
            '',
            'Prototypes should not be accessible through format strings'
        );

        // Reset
        Highcharts.setOptions({
            lang: {
                decimalPoint: '.',
                thousandsSep: ' '
            }
        });
    });

    QUnit.test('if helper', assert => {
        assert.strictEqual(
            format(
                'Value: {#if point.isNull}null{else}{point.value:.2f}{/if}',
                { point }
            ),
            'Value: 3.14',
            'Condition with falsy argument and else block'
        );

        assert.strictEqual(
            format(
                'Value: {#if nullPoint.isNull}null{else}{point.value:.2f}{/if}',
                { nullPoint }
            ),
            'Value: null',
            'Condition with true argument and else block'
        );

        assert.strictEqual(
            format(
                '{#if point.isNull}{else}{point.value:.2f}{/if}',
                { point }
            ),
            '3.14',
            'Condition with empty block'
        );

        assert.strictEqual(
            format(
                `
                Value: {#if point.key}
                Deep,
                {#if point.deep}
                deeper: {point.deep.deeper}
                {/if}
                {/if}
                `,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            'Value: Deep, deeper: 123',
            'Nested conditions'
        );

    });

    QUnit.test('foreach helper', assert => {
        assert.strictEqual(
            format(
                `{#foreach point.items}
                {@index}. {this}
                {#if @last}...{/if}
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '0. Ein 1. To 2. Tre ...',
            'Looping an array of strings'
        );

        assert.strictEqual(
            format(
                `{#foreach point.persons}
                {add @index 1}) {firstName} {lastName}
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '1) Mick Jagger 2) Keith Richards',
            'Looping an array of objects'
        );

        assert.strictEqual(
            format(
                `{#foreach nonexisting}
                - {firstName} {lastName}
                {else}
                Else-block
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            'Else-block',
            'An else-block for a loop'
        );

    });

    QUnit.test('Custom helper function', assert => {
        // Custom, non-block  helper
        Highcharts.Templating.helpers.custom = (value, divisor) =>
            value / divisor;

        assert.strictEqual(
            format(
                '{custom point.deep.deeper 1000}',
                { point }
            ),
            '0.123',
            'Custom divide helper'
        );

        // Reset
        delete Highcharts.Templating.helpers.custom;
    });

    QUnit.test('Arithmetic helpers', assert => {
        assert.strictEqual(
            format(
                '{add meat potatoes}',
                {
                    meat: 'meat',
                    potatoes: 'potatoes'
                }
            ),
            'meatpotatoes',
            'Invalid types addition'
        );
        assert.strictEqual(
            format(
                '{divide 1 0}',
                {}
            ),
            '',
            'Division by zero'
        );
    });

    QUnit.test('Subexpressions', assert => {
        assert.strictEqual(
            format(
                '{celsius}℃ == {add (multiply celsius (divide 9 5)) 32}℉',
                { celsius: 20 }
            ),
            '20℃ == 68℉',
            'Nested subexpressions'
        );

        assert.strictEqual(
            format(
                '{(divide 22 7):.2f}',
                {}
            ),
            '3.14',
            'Number formatting on expression result'
        );

        assert.strictEqual(
            format(
                '{(divide 0 22):.2f}',
                {}
            ),
            '0.00',
            'Division of zero'
        );

        assert.strictEqual(
            format(
                '{(divide 22 0):.2f}',
                {}
            ),
            '',
            'Division by zero'
        );
    });

    QUnit.test('Error handling', assert => {
        assert.strictEqual(
            format(
                `{#foreach}
                - Item
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping nothing'
        );
        assert.strictEqual(
            format(
                `{#foreach 122}
                - Item
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping number'
        );
        assert.strictEqual(
            format(
                `{#foreach false}
                - Item
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '',
            'Looping bool'
        );
        assert.strictEqual(
            format(
                `{#foreach point.persons true}
                - Item
                {/foreach}`,
                { point }
            ).replace(/\s\s+/g, ' ').trim(),
            '- Item - Item',
            'Looping excess arguments'
        );
    });


});
