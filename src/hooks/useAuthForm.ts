import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../authSlice';
import { useCookies } from 'react-cookie';
import { RootState } from '../store';
import axios, { AxiosError } from 'axios';
import { url } from '../const';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const getAuthFormScheme = (isSignUp: boolean) => {
  const baseScheme = {
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, '8桁以上のパスワードを入力してください')
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '英大文字、英小文字、数字で入力してください',
      }),
  };

  if (isSignUp) {
    return z
      .object({
        name: z.string().min(1, '名前は必須です'),
        ...baseScheme,
        confirm: z.string(),
      })
      .refine((data) => data.password === data.confirm, {
        message: 'パスワードとパスワード（確認）が異なっています。',
        path: ['confirm'],
      });
  }

  return z.object(baseScheme);
};

export const useAuthForm = (isSignUp = false, authUrl: string) => {
  const auth = useSelector((state: RootState) => state.auth.isSignIn);
  const [_cookies, setCookie] = useCookies();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authFormScheme = getAuthFormScheme(isSignUp);
  type AuthFormSchemeType = z.infer<typeof authFormScheme>;

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormSchemeType>({
    resolver: zodResolver(authFormScheme),
  });

  const onSubmit = async (data: AuthFormSchemeType) => {
    try {
      const response = await axios.post(`${url}/${authUrl}`, data);
      const token = response.data.token;
      setCookie('token', token);
      dispatch(signIn());
      navigation('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        setErrorMessage(error.response.data.ErrorMessageJP);
      }
    }
  };

  return {
    auth,
    register,
    watch,
    handleSubmit,
    errors,
    onSubmit,
    errorMessage,
  };
};
