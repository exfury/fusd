import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import React, {
  Component,
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { demicrofy, d3Formatter, formatNumeric, formatRate, formatUToken, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { useAccount } from 'contexts/account';

import styled, { DefaultTheme, useTheme } from 'styled-components';
import { WhitelistCollateral } from 'queries';
import { Chart } from 'chart.js';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { mediumDay, xTimestampAxis } from 'pages/dashboard/components/internal/axisUtils';
import big, { BigSource } from "big.js";
import { ChartTooltip } from 'pages/dashboard/components/ChartTooltip';
import { useLiquidationQueueHistory } from '@anchor-protocol/app-provider/queries/liquidate/liquidationQueueHistory';
import { HumanAddr, JSDateTime, NominalType, Rate, Token, u, UST } from '@libs/types';
import { useMyLiquidationStats } from './useLiquidationGraph';
import { AnimateNumber } from '@libs/ui';
import { PaddingSection } from './PaddingSection';
import { liquidationQueueHistoryQuery } from '@anchor-protocol/app-fns/queries/liquidate/liquidationQueueHistory';

export interface LiquidationQueueHistoryProps {
  className?: string;
  collateral: WhitelistCollateral | undefined
}

export function LiquidationQueueHistoryBase({ className, collateral }: LiquidationQueueHistoryProps) {
  const { data: liquidationQueueHistory } = useLiquidationQueueHistory();
  const allLiquidationQueue = useMemo(
    () => {
      if (!liquidationQueueHistory || !Array.isArray(liquidationQueueHistory || !collateral)) {
        return []
      }
      return liquidationQueueHistory
        .filter(history => {
          return history.token == collateral?.collateral_token
        })
        .map((history) => {
          return ({
            collateral: history.token,
            timestamp: history.timestamp,
            amount: demicrofy(history.amount as u<Token<BigSource>>),
            raw_amount: history.amount,
          })
        })
    },
    [liquidationQueueHistory, collateral],
  );

  // We compute the liquidation diff (in % in the last day)
  const liquidationDiff = useMemo(() => {
    const sorted = allLiquidationQueue
      ?.sort((a, b) => a.timestamp - b.timestamp) ?? [];

    const length = sorted.length;

    if (sorted.length >= 2 && !sorted[length - 2].amount.eq("0")) {
      return big(sorted[length - 1].raw_amount).sub(sorted[length - 2].raw_amount).div(sorted[length - 2].raw_amount)
    } else {
      return big(0)
    }
  },
    [allLiquidationQueue]
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < 500);
    }

    window.addEventListener('resize', handler);
    handler();

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);


  // We get the collateral object
  const liquidationStats = useMyLiquidationStats(
    collateral?.collateral_token,
    collateral?.symbol,
    collateral && "info" in collateral ? collateral.info : undefined
  );

  const totalPoolValueStat = useMemo(() => liquidationStats?.otherStats.find(el => el.id == "pool_value_stable"), [liquidationStats])

  const theme = useTheme();
  return (

    <PaddingSection className={className}>
      <h2 style={{ padding: 10 }}>
        <IconSpan>
          Liquidation Queue History{' '}
          <InfoTooltip>
            You can see the total amount in the liquidation queue as a function of time
          </InfoTooltip> {(
            <span className="percent" data-negative={liquidationDiff.lt(0)}>
              {big(liquidationDiff).gte(0) ? '+' : ''}
              {formatRate(liquidationDiff as Rate<BigSource>)}%
            </span>
          )}
        </IconSpan>
      </h2>

      <div style={{ fontSize: "1.5em", marginLeft: 30 }}>
        <p className="amount">
          <AnimateNumber format={totalPoolValueStat?.format_func ?? formatUSTWithPostfixUnits}>
            {(totalPoolValueStat?.value ?? 0) as UST<BigSource>}
          </AnimateNumber>
          {" "}
          <span>axlUSDC</span>
        </p>
      </div>


      <LiquidationsChart
        data={allLiquidationQueue ?? []}
        theme={theme}
        isMobile={isMobile ?? false} />
    </PaddingSection>
  );

}

export const LiquidationQueueHistory = styled(LiquidationQueueHistoryBase)`
  h2 {
    font-size: 12px;
    font-weight: 500;

    margin-bottom: 8px;

    span.percent{
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};

      &[data-negative='true'] {
        background-color: ${({ theme }) => theme.colors.negative};
      }
    }
  }

  .amount {
    font-size: 32px;
    font-weight: 500;

    span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
    }
  }

`
export interface LiquidationChartProps {
  data: {
    collateral: string;
    timestamp: number;
    amount: Big & NominalType<string>;
    raw_amount: string;
  }[];
  theme: DefaultTheme;
  isMobile: boolean;
}

export class LiquidationsChart extends Component<LiquidationChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private tooltipRef = createRef<HTMLDivElement>();
  private chart!: Chart;
  render() {
    return (
      <Container>
        <canvas ref={this.canvasRef} />
        <ChartTooltip ref={this.tooltipRef}>
          <hr />
          <section>
            <div />
          </section>
        </ChartTooltip>
      </Container>
    );
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<LiquidationChartProps>): boolean {
    return (
      this.props.data !== nextProps.data ||
      this.props.theme !== nextProps.theme ||
      this.props.isMobile !== nextProps.isMobile
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<LiquidationChartProps>) {
    if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAxis(
        this.props.data.map(({ timestamp }) => timestamp as JSDateTime),
      );
      this.chart.data.datasets[0].data = this.props.data.map(({ amount }) =>
        big(amount).toNumber(),
      );
    }

    if (prevProps.theme !== this.props.theme) {
      if (this.chart.options.scales?.x?.ticks) {
        this.chart.options.scales.x.ticks.color = this.props.theme.dimTextColor;
      }
      this.chart.data.datasets[0].borderColor =
        this.props.theme.colors.secondary;
    }

    if (prevProps.isMobile !== this.props.isMobile) {
      if (
        this.chart.options.scales?.x?.ticks &&
        'maxRotation' in this.chart.options.scales.x.ticks
      ) {
        this.chart.options.scales.x.ticks.maxRotation = this.props.isMobile
          ? undefined
          : 0;
      }
    }

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,

            external: ({ chart, tooltip }) => {
              const element = this.tooltipRef.current!;

              if (tooltip.opacity === 0) {
                element.style.opacity = '0';
                return;
              }

              const div1 = element.querySelector('div:nth-child(1)');
              const hr = element.querySelector('hr');

              if (div1) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const isLast = i === this.props.data.length - 1;
                  const item = this.props.data[i];
                  const date = isLast ? 'Now' : mediumDay(item.timestamp as JSDateTime);
                  div1.innerHTML = `${d3Formatter(item.amount)} axlUSDC <span>${date}</span>`;
                } catch (error) {
                  console.error(error);
                }
              }

              if (hr) {
                hr.style.top = chart.scales.y.paddingTop + 'px';
                hr.style.height = chart.scales.y.height + 'px';
              }

              element.style.opacity = '1';
              element.style.transform = `translateX(${tooltip.caretX}px)`;
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              font: {
                size: 11,
              },
              color: this.props.theme.dimTextColor,
            },
          },
          y: {
            grace: '25%',
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      data: {
        labels: xTimestampAxis(
          this.props.data.map(({ timestamp }) => timestamp as JSDateTime),
        ),
        datasets: [
          {
            data: this.props.data.map(({ amount }) =>
              big(amount).toNumber(),
            ),
            borderColor: this.props.theme.colors.secondary,
            borderWidth: 2,
          },
        ],
      },
    });
  };
}

// const Container = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
// `;


const Container = styled.div`
  height: 100%;
  position: relative;
  margin: 10px 50px;
  height: 220px;
`;
