import AuthForm from '../components/AuthForm.tsx';

export const SignIn = () => {
  return <AuthForm title="ログイン" errorMessage={null} authUrl="signin" />;
};
