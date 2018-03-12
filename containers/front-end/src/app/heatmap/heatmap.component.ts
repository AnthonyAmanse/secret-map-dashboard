import { Component, OnInit, HostListener} from '@angular/core';
import * as d3 from 'd3';
import {setInterval} from 'timers';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  private HEATMAP_INTERVAL = 500;
  private DEGRADED_INTERVAL = 1000;
  private degradedCells: Array<object>;
  private heatMapInterval: any;
  private HEATMAP_ROWS = 3;
  private HEATMAP_COLUMNS = 6;

  constructor() {
    this.degradedCells = [];
  }

  ngOnInit() {
    this.makeGrid();
    setInterval(() => {
      this.colorHeatMap();
    }, this.HEATMAP_INTERVAL);
    setInterval(() => {
      this.changeDegradedCell();
    }, this.DEGRADED_INTERVAL);
  }

  /**
   * Makes a grid with svg.rect elements
   */
  public makeGrid(): void {
    const width = Math.floor(d3.select('.heatmap').property('clientWidth'));
    const height =  Math.floor(d3.select('.heatmap').property('clientHeight'));
    const gridRows = Math.floor(height / (height / this.HEATMAP_ROWS));
    const gridColumns = Math.floor(width / (width / this.HEATMAP_COLUMNS));
    const svg = d3.select('.heatmap').append('g');
    const data = this.getGridCoordinates(gridRows, gridColumns);
    const cards = svg.selectAll('.cell')
      .data(data, function(d) {return d['x'] + ':' + d['y']; });
      cards.enter().append('rect')
      .attr('x', function(d) { return (d['x'] - 1) * width / gridColumns; })
      .attr('y', function(d) {
        if (d['x'] >= 4 && d['y'] === 1) {
          return 0;
        }  else {
          if (d['y'] === 0) {
            return (d['y'] - 1) * height / gridRows;
          }  else if (d['x'] >= 4 && d['y'] === 2) {
            return (d['y'] - 1) * height / gridRows - ((d['y'] - 1) * height * 0.06);
          }
          return (d['y'] - 1) * height / gridRows - ((d['y'] - 1) * height * 0.02);
        }
      })
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', width / gridColumns)
      .attr('height', function(d) {
        if (d['x'] >= 4 && d['y'] === 1) {
          return 0;
        } else {
          if (d['x'] >= 4 && d['y'] === 2) {
            return height / gridRows + (height * 0.03);
          }
          return height / gridRows - (height * 0.02);
        }
      })
      .attr('class', function(d){ return d['className']; })
      .style('stroke', '#E6E6E6')
      .style('stroke-width', '3')
      .style('fill', String(d3.rgb(255, 255, 255)));
  }

  public resizeGrid(): void {
    const width = Math.floor(d3.select('.heatmap').property('clientWidth'));
    const height = Math.floor(d3.select('.heatmap').property('clientHeight'));
    const gridRows = Math.floor(height / (height / this.HEATMAP_ROWS));
    const gridColumns = Math.floor(width / (width / this.HEATMAP_COLUMNS));
    const heatmap = d3.select('.heatmap').select('g').selectAll('rect');
    heatmap.each((data) => {
      const gridCell = d3.select(`.${data['className']}`);
      gridCell.attr('x', function (d) { return (d['x'] - 1) * width / gridColumns; })
        .attr('y', function (d) {
          if (d['x'] >= 4 && d['y'] === 1) {
            return 0;
          } else {
            if (d['y'] === 0) {
              return (d['y'] - 1) * height / gridRows;
            } else if (d['x'] >= 4 && d['y'] === 2) {
              return (d['y'] - 1) * height / gridRows - ((d['y'] - 1) * height * 0.06);
            }
            return (d['y'] - 1) * height / gridRows - ((d['y'] - 1) * height * 0.02);
        }
        })
        .attr('width', width / gridColumns)
        .attr('height', function (d) {
          if (d['x'] >= 4 && d['y'] === 1) {
            return 0;
          } else {
            if (d['x'] >= 4 && d['y'] === 2) {
              return height / gridRows + (height * 0.03);
            }
            return height / gridRows - (height * 0.02);
          }
        });
    });

  }

  /**
   * Changes specified grid cell style fill to a different color
   * @param number x
   * @param number y
   */

  public changeGridCell(x: number, y: number, decreaseFlag: boolean): void {
    const svg = d3.select('.heatmap');
    const cell = svg.select(`.gridCell${x}-${y}`);
    const rgbArray = parseRGB(cell.style('fill'));
    let colorValue = [];
    if (decreaseFlag) {
      colorValue = decreaseColor(rgbArray);
    } else {
      colorValue = increaseColor(rgbArray);
    }
    cell.style('fill', String(d3.rgb(colorValue[0], colorValue[1], colorValue[2])));
  }

  /**
   * Creates grid coordinates for building square grid
   * @param number rows     must be greater than 0
   * @param number columns     must be greater than 0
   */
  public getGridCoordinates(rows, columns): Array<object> {
    const data = new Array();
    for (let x = 1; x <= columns; x++) {
      for (let y = 1; y <= rows; y++) {
        data.push({x : x, y: y, className: `gridCell${x}-${y}`});
      }
    }
    return data;
  }

  /**
   * Creates a random step and colors grid cell every second
   */
  public colorHeatMap(): void {
    const step = randomStep(this.HEATMAP_ROWS, this.HEATMAP_COLUMNS);
    this.addDegradedCell(step);
    this.changeGridCell(step['x'], step['y'], false);
  }

  /**
   * Creates a random step and colors grid cell every second
   */
  public changeDegradedCell(): void {
    if (this.getDegradedCellsSize() > 10) {
      const step = this.retrieveDegradedCell();
      if (step) {
        this.changeGridCell(step['x'], step['y'], true);
      }
    }
  }

  /**
   * Returns HEATMAP_ROWS
   */
  public getHEATMAP_ROWS(): number {
    return this.HEATMAP_ROWS;
  }

  /**
   * Sets HEATMAP_ROWS
   * @param number rows
   */
  public setHEATMAP_ROWS(rows: number): void {
    this.HEATMAP_ROWS = rows;
  }

  /**
   * Returns HEATMAP_COLUMNS
   */
  public getHEATMAP_COLUMNS(): number {
    return this.HEATMAP_COLUMNS;
  }

  /**
   * Set HEATMAP_COLUMNS
   * @param number columns
   */
  public setHEATMAP_COLUMNS(columns: number): void {
    this.HEATMAP_COLUMNS = columns;
  }

  /**
   * Adds a degradedCell object to the queue
   */
  public addDegradedCell(degradeCell: object): void {
    this.degradedCells.push(degradeCell);
  }

  /**
   * Returns the first degradedCell object
   */
  public retrieveDegradedCell(): object {
    return this.degradedCells.shift();
  }

 /**
  * Returns the first degradedCell object
  */
  public getDegradedCellsSize(): number {
    return this.degradedCells.length;
  }

  /**
  * Checks when browser changes in size and will make the maparea responsive
  * @param - none
  */
  @HostListener('window:resize')
  public onResize(): void {
    this.resizeGrid();
  }
}

/**
 * Creates a random step
 * @param number rows      must be greater than 0
 * @param number columns      must be greater than 0
 */
export function randomStep(rows, columns): object {
  return {
    x: getRandomInt(columns),
    y: getRandomInt(rows),
  };
}

/**
 * Gets a random number between 1 and upperBound
 * @param number upperBound      must be greater than 0
 */
export function getRandomInt(upperBound: number): number {
  const randomNum = Math.floor(Math.random() * Math.floor(upperBound));
  return (randomNum > 0 ? randomNum + 1 : 1);
}

/**
 * Parses RGB string and creates a rgb array
 * @param string rgbString      must in a rgb(?,?,?) formation Ex. "rgb(255,255,255)".
 */
export function parseRGB(rgbString: string): Array<number> {
  rgbString = rgbString.replace(' ', '');
  rgbString = rgbString.replace(' ', '');
  const re = /\d+,\d+,\d+/;
  const result = rgbString.match(re)[0];
  const rgbArray = result.split(',');
  return rgbArray.map(Number);
}

/**
 * Changes cell from green to yellow to red
 * @param Array<number> rgbArray    size of Array must be 3
 */
export function increaseColor(rgbArray: Array<number>) {
  const colorVariance = 85;
  if (rgbArray[0] === 255 && rgbArray[1] === 255 && rgbArray[2] === 255) {
    return [0, 255, 0];
  } else if (rgbArray[0] < 255  && (rgbArray[1] <= 255 && rgbArray[1] > 0 ) && rgbArray[2] === 0) {
    // change grid cell to yellow
    rgbArray[0] += colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else if (rgbArray[1] > 0 ) {
    // change grid cell to red
    rgbArray[1] -= colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}

/**
 * Changes cell from red to yellow to green
 * @param Array<number> rgbArray    size of Array must be 3
 */
export function decreaseColor(rgbArray: Array<number>) {
  const colorVariance = 85;
  if (rgbArray[0] === 0 && rgbArray[1] === 255 && rgbArray[2] === 0 ) {
    return [255, 255, 255];
  } else if (rgbArray[0] === 255 && (rgbArray[1] < 255 && rgbArray[1] >= 0) && rgbArray[2] === 0) {
    // change grid cell to yellow
    rgbArray[1] += colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else if (rgbArray[0] > 0  && rgbArray[1] === 255  && rgbArray[2] === 0) {
    // change grid cell to green
    rgbArray[0] -= colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}
