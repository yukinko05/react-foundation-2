import AuthForm from '../components/AuthForm.tsx';

export const SignUp = () => {
  return <AuthForm title="新規登録" errorMessage={null} authUrl="users" isSignUp />;
};
