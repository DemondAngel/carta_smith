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
        title: 'Plot'
    };

    bigmath = create(all, {
        number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
        precision: 32           // 64 by default, only applicable for BigNumbers
      });

    constructor(props){
        super(props);
        this.state = {data:[], layout: {}, frames: [], config: {}}
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

                let value = this.bigmath.sqrt( (1/(this.bigmath.pow(1+r[i],2))) - this.bigmath.pow( ur[j]- (r[i]/(1+r[i]))  ,2) );
                vrp.push(value);
                vrn.push(-value);
            }
            
            this.data.push({
                    x: ur,
                    y: vrp,
                    type: 'scatter',
                    mode: 'lines',
                    marker: {color: color},
                });
            
            this.data.push({
                x: ur,
                y: vrn,
                type: 'scatter',
                mode: 'lines',
                marker: {color: color},
            },)
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
        }
        this.setState({data:this.data, layout: this.layout})

    }

    locateImpedance(values){
        let z = this.bigmath.complex(values.txtZ);
        let z0 = this.bigmath.complex(values.txtZ0);
        let nomZ = this.bigmath.divide(z,z0);

        let coords = this.locateInMap(nomZ, 'blue');

        let u = coords.u;
        let v = coords.v;

        let pl = this.bigmath.divide(this.bigmath.add(z,z0.neg()),this.bigmath.add(z,z0));
        console.log('El coeficiente de reflexión es: ' + pl);
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
        
        let zin = this.calculateZin(values.txtDistance, this.bigmath.atan2(v,u), rz);

        if(zin.re === nomZ.re && zin.im === nomZ.im){
            console.log("No requiere acoplador");
        }
        else{
            this.calculateStub(nomZ);
        }

        this.setState({data: this.data, layout: this.layout});

    }

    locateInMap(val, color){

        let r = val.re;
        let x = val.im;

        let u = (this.bigmath.pow(r,2) + this.bigmath.pow(x,2) -1)/( this.bigmath.pow(r,2)+2*r +this.bigmath.pow(x,2) + 1);
        let v = 0;
        if (x !== 0){
            let sqrtValue = this.bigmath.sqrt( this.bigmath.pow((this.bigmath.pow(r,2) + 2*r - this.bigmath.pow(x,2) + 1),2) / (this.bigmath.pow(x,2)*this.bigmath.pow((this.bigmath.pow(r,2) + 2*r + this.bigmath.pow(x,2) + 1),2)))

            v =  sqrtValue + 1/x;

            if(v > 1){
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

    calculateZin(distance, angle, h){
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

        console.log("La impedancia de entrada es: ");
        console.log("Real: " + r);
        console.log("Imaginario: " + x);

        return this.bigmath.complex(`${r} + ${x}`);
    }

    calculateStub(nomZ){
        let yl = this.bigmath.divide(1,nomZ);
        let coords = this.locateInMap(yl, 'yellow');
        let rp = this.bigmath.sqrt(this.bigmath.pow(coords.u,2) + this.bigmath.pow(coords.v,2));

        let v = this.bigmath.sqrt(this.bigmath.pow(rp,2) - this.bigmath.pow(rp,4));
        let u = -this.bigmath.sqrt(1/4 - this.bigmath.pow(v,2)) + 1/2;//Verificar

        let b = (2*v)/(this.bigmath.pow(u,2)-2*u+this.bigmath.pow(v,2)+1);
        console.log(`Este es el valor de u ${u}`);
        let za = this.bigmath.complex(`${1} + ${b}i`);
        this.locateInMap(za, 'purple');

        let angle0 = this.bigmath.atan2(coords.v, coords.u);
        console.log("Angulo0: " + (angle0*180)/this.bigmath.pi);
        let angle1 = this.bigmath.atan2(v, u);
        console.log("Angulo1: " + (angle1*180)/this.bigmath.pi);
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

        console.log("Distancia a la que se encuentra el Stub: " + l + "Lambdas");

        let b2 = -b;

        let v2 = (2*b2)/(this.bigmath.pow(b2,2)+1);
        let u2 = -this.bigmath.sqrt(1-this.bigmath.pow(v,2));
        console.log("Este es v2: "+ v2);
        console.log("Este es u2: " + u2);

        let finalAngle = this.bigmath.atan2(v2,u2);
        let distance = 0;

        if(finalAngle>0){
            distance = (finalAngle-180)+180;
        }
        else{
            distance = finalAngle;
        }

        distance = (0.25/this.bigmath.pi)*distance;

        console.log("La distancia es: " + finalAngle*(180/this.bigmath.pi) + " grados");
    }

    render() {
        return (
            <div className="carta-smith" id="divCartaSmith">
                <FormZ onSubmit={values => this.locateImpedance(values)}></FormZ>
                <Plot
                    data={this.state.data}
                    layout={ this.state.layout }
                    frames={this.state.frames}
                    config={this.state.config}
                    onInitialized={(figure) => this.setState(figure)}
                    onUpdate={(figure) => this.setState(figure)}
                />
            </div>
        );
    }

}