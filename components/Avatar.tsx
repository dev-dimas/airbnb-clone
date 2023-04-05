'use client';

import Image from 'next/image';

const Avatar = () => {
  return <Image className="rounded-full" height={30} width={30} alt="User Avatar" src="/images/avatar-placeholder.jpg" />;
};

export default Avatar;
