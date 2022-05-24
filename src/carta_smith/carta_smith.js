import React from "react";
import Plot from 'react-plotly.js';
import { all, create} from "mathjs";
var _ = require('underscore');

export default class CartaSmith extends React.Component{
    bigmath = create(all, {
        number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
        precision: 32           // 64 by default, only applicable for BigNumbers
      });

    data(){

        
 
        let startR1 = 0, endR1 = 3, stepR1 = 0.1;
        let r1 = _.range(startR1, endR1, stepR1);
        let startR2 = 3, endR2 = 6, stepR2 = 0.2;
        let r2 = _.range(startR2, endR2, stepR2);
        let startR3 = 6, endR3 = 11, stepR3 = 1;
        let r3 = _.range(startR3, endR3, stepR3);
        let startR4 = 11, endR4 = 51, stepR4 = 5;
        let r4 = _.range(startR4, endR4, stepR4);

        let r = [];
        r = r.concat(r1);
        r = r.concat(r2);
        r = r.concat(r3);
        r = r.concat(r4);

        let startX1 = 0, endX1 = 1, stepX1 = 0.1;
        let x1 = _.range(startX1, endX1, stepX1);
        let startX2 = 1, endX2 = 2, stepX2 = 0.2;
        let x2 = _.range(startX2, endX2, stepX2);
        let startX3 = 2, endX3 = 5, stepX3 = 0.5;
        let x3 = _.range(startX3, endX3, stepX3);
        let startX4 = 5, endX4 = 50, stepX4 = 1;
        let x4 = _.range(startX4, endX4, stepX4);
        
        let x = [];
        x = x.concat(x1);
        x = x.concat(x2);
        x = x.concat(x3);
        x = x.concat(x4);
       
        const startU = -1.2, endU = 1.2, stepU = 0.0001;

        const data = [];
        
        for(let i = 0; i < r.length; i++){
            let ur = _.range(startU, endU, stepU);
            let vrp = [];
            let vrn = [];
            for(let j = 0; j < ur.length; j++){

                let value = this.bigmath.sqrt( (1/(this.bigmath.pow(1+r[i],2))) - this.bigmath.pow( ur[j]- (r[i]/(1+r[i]))  ,2) );
                vrp.push(value);
                vrn.push(-value);
            }
            
            data.push({
                    x: ur,
                    y: vrp,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: 'black'},
                });
            
            data.push({
                x: ur,
                y: vrn,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'black'},
            },)
        }
        for(let i = 0; i < x.length; i++){
            let endVxp = (2*x[i])/(this.bigmath.pow(x[i],2) + 1);
            let endVxn = (2*-x[i])/(this.bigmath.pow(-x[i],2) + 1);
            let vxp = _.range(0, endVxp, 0.001);
            let vxn = _.range(endVxn, 0, 0.001);
            
            let uxn1 = [];
            let uxn2 = [];
            for(let j = 0; j < vxp.length; j++){
                let valpSqrt = this.bigmath.sqrt( (1/(this.bigmath.pow(x[i],2))) - this.bigmath.pow(vxp[j] -1/x[i],2));
                let valnSqrt = this.bigmath.sqrt( (1/(this.bigmath.pow(-x[i],2))) - this.bigmath.pow(vxn[j] -1/-x[i],2))
                uxn1.push(-valpSqrt+1);
                uxn2.push(-valnSqrt+1);
                
            }
            
            data.push({
                x: uxn1,
                y: vxp,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
            });

            data.push({
                x: uxn2,
                y: vxn,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'red'},
            });
        }

        
        
        return data;
    }

    render() {
        return (
            <div className="carta-smith" id="divCartaSmith">
                <Plot
                    data={this.data()}
                    layout={ {width: 1000, height: 1000, title: 'Plot'} }
                />
            </div>
        );
    }

}