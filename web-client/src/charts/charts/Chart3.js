import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { AutoSizer } from "react-virtualized";
import {
  VictoryChart,
  VictoryContainer,
  VictoryGroup,
  VictoryArea,
  VictoryPolarAxis,
  VictoryLabel
} from "victory";
import { useTheme } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import theme from "./theme";

const characterData = [
  { strength: 1, intelligence: 250, luck: 1, stealth: 40, charisma: 50 },
  { strength: 2, intelligence: 300, luck: 2, stealth: 80, charisma: 90 },
  { strength: 5, intelligence: 225, luck: 3, stealth: 60, charisma: 120 }
];

function Chart3(props) {
  const materialTheme = useTheme();

  const maxima = useMemo(() => {
    const groupedData = Object.keys(characterData[0]).reduce((acc, cur) => {
      acc[cur] = characterData.map(d => d[cur]);
      return acc;
    }, {});
    return Object.keys(groupedData).reduce((acc, cur) => {
      acc[cur] = Math.max(...groupedData[cur]);
      return acc;
    }, {});
  }, [characterData]);

  const data = useMemo(() => {
    const makeDataArray = d =>
      Object.keys(d).map(key => ({
        x: key,
        y: d[key] / maxima[key]
      }));
    return characterData.map(datum => makeDataArray(datum));
  }, [characterData, maxima]);

  const renderChart = useCallback(
    ({ width }) => {
      if (!width) return null;
      const height = 0.8 * width;

      return (
        <svg width={width} height={height}>
          <VictoryChart
            polar
            domain={{ y: [0, 1] }}
            width={width}
            height={height}
            standalone={false}
            containerComponent={<VictoryContainer responsive={false} />}
            theme={theme({ theme: materialTheme, withGrid: true })}
          >
            <VictoryGroup
              colorScale={["gold", "orange", "tomato"]}
              style={{ data: { fillOpacity: 0.2, strokeWidth: 2 } }}
            >
              {data.map((item, i) => (
                <VictoryArea key={i} data={item} />
              ))}
            </VictoryGroup>
            {Object.keys(maxima).map((key, i) => (
              <VictoryPolarAxis
                key={i}
                dependentAxis
                tickLabelComponent={<VictoryLabel labelPlacement="vertical" />}
                labelPlacement="perpendicular"
                axisValue={i + 1}
                label={key}
                tickFormat={t => Math.ceil(t * maxima[key])}
                tickValues={[0.25, 0.5, 0.75]}
              />
            ))}
            <VictoryPolarAxis labelPlacement="parallel" tickFormat={() => ""} />
          </VictoryChart>
        </svg>
      );
    },
    [data, maxima, materialTheme]
  );

  return (
    <Paper className={props.className}>
      <AutoSizer disableHeight>{renderChart}</AutoSizer>
    </Paper>
  );
}

Chart3.propTypes = {
  className: PropTypes.string
};

export default Chart3;
