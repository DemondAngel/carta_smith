import React from "react";
import Plot from 'react-plotly.js';
import { all, create} from "mathjs";
import FormZ  from './components/form_z';
var _ = require('underscore');

export default class CartaSmith extends React.Component{

    data = [];
    layout = {
        shapes: [],
        width: 1000,
        height: 1000,
        showlegend: false,
        title: 'Cara de Smith',
        annotations: []
    };

    bigmath = create(all, {
        number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
        precision: 32           // 64 by default, only applicable for BigNumbers
      });

    pl = 0;
    phi = 0;
    l = 0;
    ls = 0;
    L = 0;

    constructor(props){
        super(props);
        this.state = {data:[], layout: {}, frames: [], config: {
            scrollZoom: false,
            editable: false,
            staticPlot: true,
            displayModeBar: false
        }}
    }

    componentDidMount(){
        this.dataGraphic();
    }

    generateCircleU(r, startU, endU, stepU, color){
        for(let i = 0; i < r.length; i++){

            let ur = _.range(startU, endU, stepU);
            let vrp = [];
            let vrn = []; 
            for(let j = 0; j < ur.length; j++){

                let value = this.bigmath.sqrt( (1/(this.bigmath.pow(1+r[i],2))) - this.bigmath.pow( ur[j]- (r[i]/(1+r[i])),2));
                vrp.push(value);
                vrn.push(-value);
                
            }

            this.data.push({
                    x: ur,
                    y: vrp,
                    type: 'scatter',
                    mode: 'line',
                    marker: {color: color},
                });
            
            this.data.push({
                x: ur,
                y: vrn,
                type: 'scatter',
                mode: 'line',
                marker: {color: color},
            },);
            if (i < 20){
                let u = (r[i]-1)/(r[i]+1);
                this.layout.annotations.push({
                    x: u,
                    y: 0,
                    xref: 'x',
                    yref: 'y',
                    text: 'r=' + this.bigmath.round(r[i],2),
                    showarrow: false,
                    arrowhead: 7,
                    ax: 0,
                    ay: -40,
                    font: {
                        family: 'sans serif',
                        size: 12,
                        color: '#50A00A',
                      },

                })
            }
            
        }
    }

    dataGraphic(){
 
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

        let startX1 = 0.1, endX1 = 1, stepX1 = 0.1;
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
       
        const startU = -1.2, endU = 1.2, stepU = 0.001;

        this.data = [];
        
        this.generateCircleU(r,startU, endU, stepU, 'black');

        for(let i = 0; i < x.length; i++){
            let endVxp = (2*x[i])/(this.bigmath.pow(x[i],2) + 1);
            let endVxn = (2*-x[i])/(this.bigmath.pow(-x[i],2) + 1);
            let vxp = _.range(0, endVxp, 0.01);
            let vxn = _.range(endVxn, 0, 0.01);
            
            let uxn1 = [];
            let uxn2 = [];
            for(let j = 0; j < vxp.length; j++){
                let valpSqrt = this.bigmath.sqrt( (1/(this.bigmath.pow(x[i],2))) - this.bigmath.pow(vxp[j] -1/x[i],2));
                let valnSqrt = this.bigmath.sqrt( (1/(this.bigmath.pow(-x[i],2))) - this.bigmath.pow(vxn[j] -1/-x[i],2))
                uxn1.push(-valpSqrt+1);
                uxn2.push(-valnSqrt+1);
                
            }
            
            this.data.push({
                x: uxn1,
                y: vxp,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'black'},
            });

            this.data.push({
                x: uxn2,
                y: vxn,
                type: 'scatter',
                mode: 'lines',
                marker: {color: 'black'},
            });

            if(i < 20){
                this.layout.annotations.push({
                    x: uxn1[uxn1.length-1],
                    y: vxp[vxp.length-1],
                    xref: 'x',
                    yref: 'y',
                    text: 'x=' + this.bigmath.round(x[i],2),
                    showarrow: false,
                    arrowhead: 7,
                    ax: 0,
                    ay: -40,
                    font: {
                        family: 'sans serif',
                        size: 12,
                        color: '#1f77b4'
                      },
                  })
    
                  this.layout.annotations.push({
                    x: uxn1[uxn1.length-1],
                    y: -vxp[vxp.length-1],
                    xref: 'x',
                    yref: 'y',
                    text: 'x=' + -this.bigmath.round(x[i],2),
                    showarrow: false,
                    arrowhead: 7,
                    ax: 0,
                    ay: -40,
                    font: {
                        family: 'sans serif',
                        size: 12,
                        color: '#1f77b4'
                      },
                  })
            }

           
        }
        this.setState({data:this.data, layout: this.layout})

    }

    locateImpedance(values){
        this.layout = {
            shapes: [],
            width: 1000,
            height: 1000,
            showlegend: false,
            title: 'Cara de Smith',
            annotations: []
        };

        if(values.txtF !== 0)
            this.lambda = 3*this.bigmath.pow(10,8)/values.txtF;
        else
            this.lambda = 0;

        this.dataGraphic();

        let z = this.bigmath.complex(values.txtZ);
        let z0 = this.bigmath.complex(values.txtZ0);
        let nomZ = this.bigmath.divide(z,z0);

        let coords = this.locateInMap(nomZ, 'blue','imp');

        let u = coords.u;
        let v = coords.v;
        this.layout.annotations.push({
            x: u,
            y: v,
            xref: 'x',
            yref: 'y',
            text: '<b>zL=' + z.toString() + '</b>',
            showarrow: false,
            arrowhead: 7,
            ax: 0,
            ay: -40,
            font: {
                size: 16,
                color: 'blue'
              },

        });

        this.data.push({
            x: [0, u],
            y: [0, v],
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'blue'},
        });

        let pl = this.bigmath.divide(this.bigmath.add(z,z0.neg()),this.bigmath.add(z,z0));
        this.pl = pl.toPolar().r;
        this.phi = pl.toPolar().phi*180/this.bigmath.pi;
        let rz = this.bigmath.sqrt(this.bigmath.pow(u,2) + this.bigmath.pow(v,2));
        let us = _.range(-1, 1, 0.001);
        let v1 = [];
        let v2 = [];

        for(let i = 0; i < us.length; i++){
            let value = this.bigmath.sqrt(this.bigmath.pow(rz,2) - this.bigmath.pow(us[i],2));
            v1.push(value);
            v2.push(-value);
        }

        this.data.push({
            x: us,
            y: v1,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'green'},
        });

        this.data.push({
            x: us,
            y: v2,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'green'},
        });
        
        let zin = this.calculateZin(values.txtDistance, this.bigmath.atan2(v,u), rz, z0);

        if(this.lambda === 0){
            this.l = values.txtDistance + "&lambda;";
        }
        else{
            this.l = values.txtDistance*this.lambda;
        }

        if((zin.re === nomZ.re && zin.im === nomZ.im) || nomZ.re === 0 || nomZ.re >= 3.37777){
            console.log("No requiere acoplador");
        }
        else{
            this.calculateStub(nomZ, z0);
        }

        this.setState({data: this.data, layout: this.layout});

    }

    locateInMap(val, color, type){

        let r = val.re;
        let x = val.im;

        let u = (this.bigmath.pow(r,2) + this.bigmath.pow(x,2) -1)/( this.bigmath.pow(r,2)+2*r +this.bigmath.pow(x,2) + 1);
        let v = 0;
        if (x !== 0){
            let sqrtValue = this.bigmath.sqrt( this.bigmath.pow((this.bigmath.pow(r,2) + 2*r - this.bigmath.pow(x,2) + 1),2) / (this.bigmath.pow(x,2)*this.bigmath.pow((this.bigmath.pow(r,2) + 2*r + this.bigmath.pow(x,2) + 1),2)))
            v =  sqrtValue + 1/x;
            if( (((u < 0 && v > 0) || (u > 0 && v < 0)) && type === 'stub') || v < -1 || v > 1){
                v = -sqrtValue +1/x;
            }
            
        }

        let radius = 0.01;

        this.layout.shapes.push(
            {
                type:'circle',
                xref: 'x',
                yref: 'y',
                x0: u-radius,
                x1: u+radius,
                y0: v-radius,
                y1: v+radius,
                opacity: 1,
                fillcolor: color,
                line: {
                    color: color
                }
            }
        );

        return {
            u: u,
            v: v
        };
    }

    calculateZin(distance, angle, h, z0){
        let u = 0;
        let v = 0;
        let location = (angle*0.25)/this.bigmath.pi-distance;

        while(location < -0.25){
            location += 0.5;
        }

        location = location*(this.bigmath.pi/0.25);
        u = h*this.bigmath.cos(location);
        v = h*this.bigmath.sin(location);

        let r0 = 0.01;

        this.layout.shapes.push(
            {
                type:'circle',
                xref: 'x',
                yref: 'y',
                x0: u-r0,
                x1: u+r0,
                y0: v-r0,
                y1: v+r0,
                opacity: 1,
                fillcolor: 'red',
                line: {
                    color: 'red'
                }
            });

        let r = (-this.bigmath.pow(u,2) - this.bigmath.pow(v,2) +1) / (this.bigmath.pow(u,2) - 2*u + this.bigmath.pow(v,2) +1);
        let x = (2*v)/(this.bigmath.pow(u,2)-2*u+this.bigmath.pow(v,2)+1);

        let zin = this.bigmath.complex(`${r} + ${x}i`);
        let Zin = this.bigmath.multiply(zin, z0);
        this.layout.annotations.push({
            x: u,
            y: v,
            xref: 'x',
            yref: 'y',
            text: '<b>Zin=' + this.bigmath.round(Zin,2).toString() + '</b>',
            showarrow: false,
            arrowhead: 7,
            ax: 0,
            ay: -40,
            font: {
                size: 16,
                color: 'red'
              },

        });
        this.data.push({
            x: [0, u],
            y: [0, v],
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
        });

        return zin;
    }

    calculateStub(nomZ, z0){
        let yl = this.bigmath.divide(1,nomZ);
        
        let coords = this.locateInMap(yl, 'yellow','stub');
        this.data.push({
            x: [0, coords.u],
            y: [0, coords.v],
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'yellow'},
        });
        let rp = this.bigmath.sqrt(this.bigmath.pow(coords.u,2) + this.bigmath.pow(coords.v,2));
        let v = 0;
        let sqrtU = 0;
        let u = 0;


        v = this.bigmath.sqrt(this.bigmath.pow(rp,2) - this.bigmath.pow(rp,4));
        sqrtU = this.bigmath.sqrt(1/4 - this.bigmath.pow(v,2));
        u =  sqrtU + 1/2;

        if(nomZ.re>=1){
            //v = -v
            u = -sqrtU + 1/2;
        }
        
        let b = (2*v)/(this.bigmath.pow(u,2)-2*u+this.bigmath.pow(v,2)+1);
        let za = this.bigmath.complex(`${1} + ${b}i`);
        let Za = this.bigmath.multiply(this.bigmath.divide(1,za), z0);
        let coordsStub = this.locateInMap(za, 'purple', 'stub');
        this.layout.annotations.push({
            x: coordsStub.u,
            y: coordsStub.v,
            xref: 'x',
            yref: 'y',
            text: '<b>Za=' + this.bigmath.round(Za,2).toString() + '</b>',
            showarrow: false,
            arrowhead: 7,
            ax: 0,
            ay: -40,
            font: {
                size: 16,
                color: 'purple'
              },

        });

        this.data.push({
            x: [0, coordsStub.u],
            y: [0, coordsStub.v],
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'purple'},
        });
        
        let angle0 = this.bigmath.atan2(coords.v, coords.u);
        let angle1 = this.bigmath.atan2(v, u);
        let angleTotal = 0;

        if(angle0 < 0 && angle1 > 0){
            angleTotal = angle1 + this.bigmath.abs(angle0);
        }
        else if(angle0 > 0 && angle1 < 0){
            angleTotal = angle0 + this.bigmath.abs(angle1);
        }
        else{
            angleTotal = this.bigmath.abs(angle1-angle0);
        }

        let l = (0.25/this.bigmath.pi)*angleTotal;

        let b2 = -b;

        let v2 = this.bigmath.sqrt(this.bigmath.pow(-this.bigmath.pow(b2,2)+1,2)/( this.bigmath.pow(b2,2)*this.bigmath.pow(this.bigmath.pow(b2,2)+1,2))) + 1/b2;

        let u2 = (this.bigmath.pow(b2,2)-1)/(this.bigmath.pow(b2,2)+1);
        
        this.data.push({
            x: [0, u2],
            y: [0, v2],
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'black'},
        });

        let finalAngle = this.bigmath.atan2(v2,u2);
        let distance = 0;

        if(finalAngle>0){
            distance = (finalAngle-180)+180;
        }
        else{
            distance = finalAngle;
        }
        
        if(distance < 0){
            distance = -distance;
        }
        else{
            distance = 360-distance;
        }
        distance = (0.25/this.bigmath.pi)*distance;

        if(this.lambda === 0){
            this.la = l +'&lambda;';
            this.L = distance + '&lambda;';
        }
        else{
            this.la = l*this.lambda;
            this.L = distance*this.lambda;
        }
        
    }

    render() {
        return (
            <div className="carta-smith" id="divCartaSmith">
                <div className="container">
                    <div className="row-auto">
                        <div className="grid grid-cols-2">
                        <div>
                        <FormZ onSubmit={values => this.locateImpedance(values)}></FormZ>
                            <div className="p-5">
                                pl = {this.pl}m
                                <br/>
                                &theta; = {this.phi}??
                                <br/>
                                l = {this.l}m
                                <br/>
                                Distancia al Stub = {this.la}m
                                <br/>
                                L = {this.L}m
                            </div>
                            
                        </div>

                        <Plot
                            data={this.state.data}
                            layout={ this.state.layout }
                            frames={this.state.frames}
                            config={this.state.config}
                            onInitialized={(figure) => this.setState(figure)}
                            onUpdate={(figure) => this.setState(figure)}
                        />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}