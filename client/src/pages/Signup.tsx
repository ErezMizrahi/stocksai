import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '../components/styled/Auth.styled';
import { Link, useNavigate } from "react-router-dom";
import Logo from '../components/Logo';
import userApi from '../api/user.api';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
});

type FormFields = z.infer<typeof schema>;

const Signup = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(schema)});
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit: SubmitHandler<FormFields> = async (data: Omit<FormFields, 'confirmPassword'>) => {
        try {
            const response = await userApi.signup(data.email, data.password);

            if (response.success) {
                console.log('Signup successful');
                setUser(response.success);
                navigate('/dashboard', { replace: true })
            } else {
                const { message } = response.error;
                setError('email', { message}); 
            }
        } catch (error) {
            console.log(error)
            setError('email', { message: 'from try cat2ch'});
        }
    }

  return (
    <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Logo />
            
            <div className='input-container'>
                <input {...register('email')} type="text" name='email' placeholder='email address' />
                {errors.email && <div className='error'> {errors.email.message} </div>}
            </div>
            
            <div className='input-container'>
                <input {...register('password')} type='text' name='password' placeholder='password'/>
                {errors.password && <div className='error'> {errors.password.message} </div>}
            </div>

            <div className='input-container'>
                <input {...register('confirmPassword')} type='text' name='confirmPassword' placeholder='confirm password'/>
                {errors.confirmPassword && <div className='error'> {errors.confirmPassword.message} </div>}
            </div>
            

            <button type='submit' disabled={isSubmitting}> 
                {
                    isSubmitting ? 'Loading...' : 'Signup'
                }
            </button>
        </form>

        <p> already have an account? <Link to={'/login'}>login</Link></p>
    </Container>
  )
}

export default Signup