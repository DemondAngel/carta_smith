import React from 'react';
import { useFormik } from "formik"
import { create, all } from 'mathjs'
import './styles/form_z.css'

const bigmath = create(all, {
    number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
    precision: 32           // 64 by default, only applicable for BigNumbers
  });

const validate = values => {
    const errors = {};

    if(!values.txtZ){
        errors.txtZ = 'Campo requerido'
    }
    else if(values.txtZ.length >= 10000){
        errors.txtZ = "La impedancia característica no debe pasar de 10000 caracteres";
    }
    else {

        try{
            bigmath.complex(values.txtZ);
            
        }
        catch(e){
            errors.txtZ = "El formato debe ser el siguiente r + xi";
        }
        
    }

    if(!values.txtZ0){
        errors.txtZ0 = 'Campo requerido'
    }
    else if(values.txtZ0.length >= 10000){
        errors.txtZ0 = "La impedancia característica no debe pasar de 10000 caracteres";
    }
    else {
        try{
           let z0 = bigmath.complex(values.txtZ0);  
           if(bigmath.compare(z0.toPolar().r, 0) === 0){
               errors.txtZ0 = "La impedancia característica no puede ser cero."
           }
        }
        catch(e){
            errors.txtZ0 = "El formato debe ser el siguiente r + xi";
        }
    }

    if(!values.txtDistance){
        errors.txtDistance = 'Campo requerido';
    }

    if(!values.txtF){
        errors.txtF = "Campo requerido";
    }

    return errors; 

}

const FormZ = ({onSubmit}) => {

    const formik = useFormik({
        initialValues: {
            txtZ: '',
            txtZ0: '',
            txtDistance: '',
            txtF: ''
        },
        validate,
        onSubmit,
    });

    return (
        <form className="p-5 m-3" onSubmit={formik.handleSubmit}>
            <h1 >Datos</h1>
            <div className="container ml-5">
                <div className="row-auto">
                    <label htmlFor="txtZ">Impedancia a Localizar: </label>
                    <input onChange={formik.handleChange} value={formik.values.txtZ} id="txtZ" placeholder="Impedancia a Localizar" name="txtZ" type="text" required/>
                    {formik.errors.txtZ ? <div className="input-error">{formik.errors.txtZ}</div> : null}
                </div>
                <div className="row-auto">
                    <label htmlFor="txtZ0">Impedancia Característica: </label>
                    <input onChange={formik.handleChange} value={formik.values.txtZ0} id="txtZ0" placeholder="Impedancia Característica" name="txtZ0" type="text" required/>
                    {formik.errors.txtZ0 ? <div className="input-error">{formik.errors.txtZ0}</div> : null}
                </div>
                <div className="row-auto">
                <label htmlFor="txtDistance">Distancia: </label>
                <input onChange={formik.handleChange} value={formik.values.txtDistance} id="txtDistance" placeholder='Distancia' min='0' max='100000' step='0.0001' type="number" required />
                {formik.errors.txtDistance ? <div className="input-error">{formik.errors.txtDistance}</div>: null}
                </div>
                <div className="row-auto">
                <label htmlFor="txtDistance">Frecuencia de trabajo en Hz: </label>
                <input onChange={formik.handleChange} value={formik.values.txtF} id="txtF" placeholder='Frecuencia de trabajo en Hz' min='0' max='1000000000000' step='0.0001' type="number" required />
                {formik.errors.txtF ? <div className="input-error">{formik.errors.txtF}</div>: null}
                </div>
                <div className="row-auto">
                <input type="submit" value="Localizar" />
                </div>
            </div>

            
        </form>

    )
}

export default FormZ;