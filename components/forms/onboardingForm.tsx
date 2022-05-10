import React, {useState, useEffect, useContext} from 'react';
import { TextField } from '../textfield';
import * as Joi from 'joi';
import { Dropdown } from '../dropdown';
import { Datepicker } from '../datepicker';
import { useRouter } from 'next/router'
import { AuthErrorMessages } from '../../const/errors';
import AuthContext from '../../context/AuthContext'
import { Authentication } from '../../api/auth';
import { toasty } from '../../util/toasty';
import { AuthSuccessMessages } from '../../const/success';


const OnboardingForm: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [birthday, setBirthday] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState<ErrObj>({});
  const [telephone, setTelephone] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter()
  const { firstname, lastname, password, email_address } = router.query
  

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])
  const alertUser = e => {
    e.preventDefault()
    e.returnValue = ''
  }
  interface ErrObj {
      email?: string;
      telephone?: string;
      birthday?: string;
      gender?: string;
      country?: string;
      state?: string;
      city?: string;
  }
  const schema = Joi.object({
      birthday: Joi.string().required().messages({'string.empty': AuthErrorMessages.birthdayRequired}),
      country: Joi.string().required().messages({'string.empty': AuthErrorMessages.countryRequired}),
      state: Joi.string().required().messages({'string.empty': AuthErrorMessages.stateRequired}),
      gender: Joi.string().required().messages({'string.empty': AuthErrorMessages.genderRequired}),
      city: Joi.string().required().messages({'string.empty': AuthErrorMessages.cityRequired})
  });

  const user = {
    first_name: firstname,
    last_name: lastname,
    email_address,
    password,
    dob: birthday,
    gender,
    country,
    state,
    primary_phone: telephone,
    city
}
  const validateForm = () => {
    const errors: any = {};
    const options = {abortEarly: false}
    const { error } = schema.validate({birthday: birthday, gender: gender, country: country, state: state, city: city}, options );
    if (error) {
      for (let e of error.details) {
          let message = e.message.replace(/"/g, "")
          errors[e.path[0]] = message.charAt(0).toUpperCase() + message.slice(1);
      } 
      return errors;
    }
    return errors
  }
  const handleSubmit = async (e: any) => {
      e.preventDefault();
      const errors = validateForm()
      setError(errors)
      if (Object.values(errors).every(x => x === null || x === '')) {
        const res = await Authentication.register(user)
        if (res.success){
          localStorage.removeItem("isSigningUp");
          await Authentication.login(email_address, password)
          router.replace('/')
          authCtx.loadUser()
          toasty('success', AuthSuccessMessages.onboarding)

        }
      }
      
  };
  const genderList = [
    {
      name: "Male",
      value: "MALE"
    },
    {
      name: "Female",
      value: "FEMALE"
    },
    {
      name: "Prefer not to say",
      value: "UNIDENTIFIED"
    }
  ]
  
      return (
          <div className='form pane-form'>
  
              <form onSubmit={handleSubmit}>
                <div className="double-textbox">

                  <Dropdown 
                    valueLabel='Gender'
                    optionList={genderList}
                    onChange={(e: any)=> setGender(e.target.value)}
                    error={error.gender}
                  />
                  <Datepicker 
                  valueLabel='Birthday'
                  onChange={(e: any)=> setBirthday(e.target.value)}
                  error={error.birthday}
                  />
                </div>
                <div className="double-textbox">
                  <Dropdown 
                      valueLabel='Country'
                      optionList={[{name: "The Bahamas", value: "BAH"}]}
                      onChange={(e: any)=> setCountry(e.target.value)}
                      error={error.country}
                    />
                  <Dropdown 
                      valueLabel='State/Island'
                      optionList={[{name: "New Providence", value: "NEW PROVIDENCE"}]}
                      onChange={(e: any)=> setState(e.target.value)}
                      error={error.state}
                  />
                </div>

                <TextField 
                      name='city'
                      valueType='text'
                      valueLabel='City'
                      onChange={(e: any)=> setCity(e.target.value)}
                      value={city}
                      className='med-textbox'
                      error={error.city}
                />

                  <TextField 
                      name='telephone'
                      valueType='telephone'
                      valuePlaceholder='242 123 4567'
                      valueLabel='Phone contact'
                      optional={true}
                      onChange={(e: any)=> setTelephone(e.target.value)}
                      value={telephone}
                      className='med-textbox'
                      error={error.telephone}
                  />
                 
                 <input type="submit" value="Complete sign up" className='btn btn-primary btn-form' />
              </form>

        </div>


    )
};
export { OnboardingForm};