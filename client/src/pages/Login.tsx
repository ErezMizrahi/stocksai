import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '../components/styled/Auth.styled';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import userApi from '../api/user.api';
import useLocalstorage from '../hooks/useLocalstorage';
import { setHeaderToken } from '../utils/client';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(schema)});
    const navigate = useNavigate();
    const { user, setUser, setAccessToken } = useAuth();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await userApi.login(data.email, data.password);

            if (response.success) {
                console.log('Login successful');
                setAccessToken(response.success.access_token)
                setUser(response.success);
                navigate('/dashboard', { replace: true });
                
            } else {
                const { message } = response.error;
                setError('email', { message});
            }
        } catch (error) {
            console.log(error)
            setError('email', { message: 'General Error...'});
        }
    }

    if(user){
        return <Navigate to="/dashboard" />
    }

  return (
    <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Logo />
            
            <div className='input-container'>
                <input {...register('email')} type="email" name='email' placeholder='email address' autoComplete='email' />
                {errors.email && <div className='error'> {errors.email.message} </div>}
            </div>
            
            <div className='input-container'>
                <input {...register('password')} type='password' name='password' placeholder='password' autoComplete='current-password'/>
                {errors.password && <div className='error'> {errors.password.message} </div>}
            </div>
            

            <button type='submit' disabled={isSubmitting}> 
                {
                    isSubmitting ? 'Loading...' : 'Login'
                }
            </button>
        </form>

        <p> don't have an account? <Link to={'/signup'}>sign up</Link></p>
    </Container>
  )
}

export default Login