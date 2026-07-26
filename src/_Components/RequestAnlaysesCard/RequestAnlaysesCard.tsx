import React from 'react';

const RequestAnlaysesCard = ({
  title,
  number,
  icon: Icon,
}: {
  title: string;
  number: number;
  icon: any;
}) => {
  return (
    <div className="p-5 border bg-neutral-100 border-neutral-300 flex justify-between gap-3 items-center rounded-md">
      <div className="detaisl ">
        <h3 className="text-14 text-neutral-700 font-medium">{title}</h3>
        <p className="font-bold text-40 text-primary-500">{number}</p>
      </div>
      <span className="icon w-14 h-14 flex justify-center items-center bg-primary-50 rounded-full">
        <Icon className="w-8 h-8 text-primary-500" />
      </span>
    </div>
  );
};

export default RequestAnlaysesCard;
