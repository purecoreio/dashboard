import type { ChartConfiguration } from "chart.js"

export function dummyData(): ChartConfiguration {
    const xy: any[] = [...Array(7 * 24)].map((_, i) => {
        const obj = {
            x: new Date(new Date().getTime() - 3600 * i * 1000),
            y: Math.trunc(Math.sin(i / 10) * 8 + Math.trunc(Math.random() * 4) + 17 + Math.trunc(Math.sin(i / 8) * 3 + 3))
        }
        return obj
    })
    const [minimum, avg, maximum] = [...new Array(3)].map((_, i) => {
        return {
            label: (() => {
                if (i == 0) return 'minimum'
                if (i == 1) return 'avg'
                return 'maximum'
            })(),

            data: xy.map(d => {
                return {
                    x: d.x,
                    y: d.y + i * 5
                }
            })
        }
    })
    const borderColor = "#FF6384"
    const backgroundColor = "rgba(255, 177, 193, 0.9)"
    return {
        type: 'line',
        data: {
            datasets: [{
                ...avg,
                borderColor: '#000'
            },
            {
                ...maximum,
                borderColor,
                backgroundColor,
            },
            {
                ...minimum,
                fill: 'stack',
                borderColor,
                backgroundColor,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                },
                y: {
                    min: 0
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 10,
                }
            }
        }
    }
}