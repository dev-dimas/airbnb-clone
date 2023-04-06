'use client';

import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

import useRegisterModal from '@/app/hooks/useRegisterModal';

import Button from '../Button';
import Heading from '../Heading';
import Input from '../inputs/input';
import Modal from './Modal';

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post('/api/register', data)
      .then(() => {
        registerModal.onClose();
      })
      .catch((error) => {
        toast.error('Something Went Wrong', { id: 'failedSignUp' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (errors.email) {
      toast.error('Invalid email', { id: 'invalidEmail', duration: 2000 });
    } else if (errors.name) {
      toast.error("Name field can't be blank", { id: 'emptyName', duration: 2000 });
    } else if (errors.password) {
      toast.error('Password must have at least 8 characters', { id: 'invalidPassword', duration: 2000 });
    }
  }, [errors.email, errors.name, errors.password]);

  const bodyForm = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input id="email" label="Email" type="email" register={register} pattern={/^\S+@\S+$/i} errors={errors} required />
      <Input id="name" label="Name" register={register} errors={errors} required />
      <Input id="password" label="Password" type="password" register={register} minLength={8} errors={errors} required />
    </div>
  );

  const footerForm = (
    <div className="mt-3 flex flex-col gap-4">
      <Button outline label="Continue With Google" icon={FcGoogle} onClick={() => signIn('google')} />
      <div className="mt-4 text-center font-light text-neutral-500">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Already have an account?</div>
          <span className="cursor-pointer text-neutral-800 hover:underline" onClick={registerModal.onClose}>
            Log in
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyForm}
      footer={footerForm}
    />
  );
};

export default RegisterModal;
