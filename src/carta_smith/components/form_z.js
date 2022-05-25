import React from 'react';
import { useFormik } from "formik"
import { create, all } from 'mathjs'

const bigmath = create(all, {
    number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
    precision: 32           // 64 by default, only applicable for BigNumbers
  });

const validate = values => {
    const errors = {};

    if(!values.txtZ){
        errors.txtZ = 'Required'
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
        errors.txtZ0 = 'Required'
    }
    else if(values.txtZ0.length >= 10000){
        errors.txtZ0 = "La impedancia característica no debe pasar de 10000 caracteres";
    }
    else {
        try{
           bigmath.complex(values.txtZ0);
            
        }
        catch(e){
            errors.txtZ0 = "El formato debe ser el siguiente r + xi";
        }
    }

    return errors; 

}

const FormZ = ({onSubmit}) => {

    const formik = useFormik({
        initialValues: {
            txtZ: '',
            txtZ0: '',
            txtDistance: ''
        },
        validate,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="txtZ">Impedancia a Localizar</label>
            <input onChange={formik.handleChange} value={formik.values.txtZ} id="txtZ" placeholder="Impedancia a Localizar" name="txtZ" type="text" required/>
            {formik.errors.txtZ ? <div>{formik.errors.txtZ}</div> : null}
            <br/>
            <label htmlFor="txtZ0">Impedancia Característica</label>
            <input onChange={formik.handleChange} value={formik.values.txtZ0} id="txtZ0" placeholder="Impedancia Característica" name="txtZ0" type="text" required/>
            {formik.errors.txtZ0 ? <div>{formik.errors.txtZ0}</div> : null}
            <br/>
            <label htmlFor="txtDistance">Distancia</label>
            <input onChange={formik.handleChange} value={formik.values.txtDistance} id="txtDistance" placeholder='Distancia' min='0' max='100000' step='0.0001' type="number" required />
            <br />
            <input type="submit" value="Localizar" />
        </form>

    )
}

export default FormZ;